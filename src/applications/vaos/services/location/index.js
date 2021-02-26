/**
 * @module services/Location
 */
import environment from 'platform/utilities/environment';

/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */

import {
  getFacilitiesBySystemAndTypeOfCare,
  getFacilityInfo,
  getFacilitiesInfo,
  getDirectBookingEligibilityCriteria,
  getRequestEligibilityCriteria,
  getCommunityCareFacilities,
} from '../var';
import { mapToFHIRErrors } from '../utils';
import {
  transformDSFacilities,
  transformFacilities,
  transformFacility,
  setSupportedSchedulingMethods,
  transformCommunityProviders,
} from './transformers';
import { VHA_FHIR_ID } from '../../utils/constants';
import { calculateBoundingBox } from '../../utils/address';

/**
 * Fetch facility information for the facilities in the given site, based on type of care
 *
 * @export
 * @async
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {String} locationParams.siteId A VistA site id for the locations being pulled
 * @param {String} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {String} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Array} A FHIR searchset of Location resources
 */
export async function getSupportedLocationsByTypeOfCare({
  siteId,
  parentId,
  typeOfCareId,
}) {
  try {
    const parentFacilities = await getFacilitiesBySystemAndTypeOfCare(
      siteId,
      parentId,
      typeOfCareId,
    );

    return transformDSFacilities(
      // Doing this here because the FHIR service will return only supported facilities
      parentFacilities.filter(
        f => f.directSchedulingSupported || f.requestSupported,
      ),
    ).sort((a, b) => (a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1));
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Fetch list of facilities
 *
 * @export
 * @async
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.facilityIds A list of va facility ids to fetch
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getLocations({ facilityIds }) {
  try {
    const facilities = await getFacilitiesInfo(facilityIds);

    return transformFacilities(facilities);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Fetch facility information for the given site
 *
 * @export
 * @async
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.facilityId An id for the facility to fetch info for
 * @returns {Object} A FHIR Location resource
 */
export async function getLocation({ facilityId }) {
  try {
    const facility = await getFacilityInfo(facilityId);

    return transformFacility(facility);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
/**
 * Returns facilities with current settings for both direct scheduling
 * and requests for all types of care
 *
 * @export
 * @async
 * @param {Object} params
 * @param {Array<string>} siteIds A list of 3 digit site ids to retrieve the settings for
 * @param {boolean} directSchedulingEnabled If we need to fetch direct scheduling settings as well
 * @returns {Array<Location>} An array of Locations with settings included
 */
export async function getLocationsByTypeOfCareAndSiteIds({
  siteIds,
  directSchedulingEnabled,
}) {
  try {
    let locations = [];

    const promises = [getRequestEligibilityCriteria(siteIds)];

    if (directSchedulingEnabled) {
      promises.push(getDirectBookingEligibilityCriteria(siteIds));
    }

    const criteria = await Promise.all(promises);

    // If patientHistoryRequired is blank or null, the scheduling method is
    // disabled for that type of care.  If "No", it is enabled, but doesn't require
    // a previous appointment.  If "Yes", it is enabled and requires a previous appt

    const requestFacilityIds = criteria[0]?.map(facility => facility.id) || [];
    const directFacilityIds = directSchedulingEnabled
      ? criteria[1]?.map(facility => facility.id) || []
      : [];

    const uniqueIds = Array.from(
      new Set([...directFacilityIds, ...requestFacilityIds]),
    );

    // The above API calls only return the ids. Make an additional
    // call to getLocations so we can get additional details such
    // as name, address, coordinates, etc.
    if (uniqueIds.length) {
      locations = await getLocations({
        facilityIds: uniqueIds,
      });

      locations = locations?.map(location =>
        setSupportedSchedulingMethods({
          location,
          requestFacilities: criteria[0] || [],
          directFacilities: directSchedulingEnabled ? criteria[1] || [] : [],
        }),
      );
    }

    return locations.sort((a, b) => (a.name < b.name ? -1 : 1));
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Get the parent organization of a given location
 *
 * @export
 * @param {Arrray} organizations The organizations to search through
 * @param {Object} location The location resource to find the parent of
 * @returns {Object} The parent organization
 */
export function getParentOfLocation(organizations, location) {
  const orgId = location.managingOrganization.reference.split('/')[1];
  return organizations.find(parent => parent.id === orgId);
}

/**
 * Pulls the VistA id from an Location resource
 *
 * @export
 * @param {Object} location The location to get an id for
 * @returns {String} Three digit or 5 digit VistA id
 */
export function getFacilityIdFromLocation(location) {
  return location.identifier.find(id => id.system === VHA_FHIR_ID)?.value;
}

/**
 * Returns the siteId of a var location
 *
 * @param {String} id A location's fake FHIR id
 */
export function getSiteIdFromFacilityId(id) {
  return id ? id.substr(0, 3) : null;
}

/**
 * Converts back from a real facility id to our test facility ids
 * in lower environments
 *
 * @export
 * @param {String} facilityId - facility id to convert
 * @returns A facility id with either 442 or 552 replaced with 983 or 984
 */
export function getTestFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('442', '983').replace('552', '984');
  }

  return facilityId;
}

/**
 * Returns formatted address from facility details object
 *
 * @param {*} facility - facility details object
 */
export function formatFacilityAddress(facility) {
  return `${facility.address?.line.join(', ')}, ${facility.address?.city}, ${
    facility.address?.state
  } ${facility.address?.postalCode}`;
}

/**
 * Fetch community care providers by location and type of care
 *
 * @export
 * @async
 * @param {Object} locationsParams Parameters needed for fetching providers
 * @param {Object} locationParams.address The address in VA Profile format to search nearby
 * @param {Object} locationParams.typeOfCare Type of care data to use when searching for providers
 * @param {Number} locationParams.radius The radius to search for providers within, defaulted to 60
 * @param {Number} locationParams.maxResults The max number of results to return from the search
 * @returns {Array} A FHIR searchset of Location resources
 */
export async function getCommunityProvidersByTypeOfCare({
  address,
  typeOfCare,
  radius = 60,
  maxResults = 15,
}) {
  try {
    const communityCareProviders = await getCommunityCareFacilities({
      bbox: calculateBoundingBox(address.latitude, address.longitude, radius),
      latitude: address.latitude,
      longitude: address.longitude,
      radius,
      specialties: typeOfCare.specialties,
      page: 1,
      perPage: maxResults,
    });

    return transformCommunityProviders(communityCareProviders);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
