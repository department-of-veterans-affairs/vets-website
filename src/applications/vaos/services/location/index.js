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
} from '../var';
import { mapToFHIRErrors } from '../utils';
import {
  transformDSFacilities,
  transformFacilities,
  transformFacility,
  setSupportedSchedulingMethods,
} from './transformers';
import { VHA_FHIR_ID } from '../../utils/constants';

/*
 * This is used to parse the fake FHIR ids we create for organizations
 */
function parseId(id) {
  return id.replace('var', '');
}

/**
 * Fetch facility information for the facilities in the given site, based on type of care
 *
 * @export
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
      parseId(parentId),
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
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.facilityIds A list of va facility ids to fetch
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getLocations({ facilityIds }) {
  try {
    const facilities = await getFacilitiesInfo(facilityIds.map(parseId));

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
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.facilityId An id for the facility to fetch info for
 * @returns {Object} A FHIR Location resource
 */
export async function getLocation({ facilityId }) {
  try {
    const facility = await getFacilityInfo(parseId(facilityId));

    return transformFacility(facility);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

export async function getLocationsByTypeOfCareAndSiteIds({
  typeOfCareId,
  siteIds,
}) {
  try {
    let locations = [];

    const criteria = await Promise.all([
      getDirectBookingEligibilityCriteria(siteIds),
      getRequestEligibilityCriteria(siteIds),
    ]);

    // Fetch facilities that support direct scheduling and filter
    // only those that support the selected type of care
    const directFacilityIds =
      criteria[0]
        ?.filter(facility =>
          facility?.coreSettings?.some(
            setting =>
              setting.id === typeOfCareId && !!setting.patientHistoryRequired,
          ),
        )
        ?.map(facility => facility.id) || [];

    // If patientHistoryRequired is blank or null, the scheduling method is
    // disabled for that type of care.  If "No", it is enabled, but doesn't require
    // a previous appointment.  If "Yes", it is enabled and requires a previous appt

    // Fetch facilities that support requests and filter
    // only those that support the selected type of care
    const requestFacilityIds =
      criteria[1]
        ?.filter(facility =>
          facility?.requestSettings?.some(
            setting =>
              setting.id === typeOfCareId && !!setting.patientHistoryRequired,
          ),
        )
        ?.map(facility => facility.id) || [];

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

      // Update the retrieved locations with requestSupported and
      // directSchedulingSupported, as well as replace IDs for dev/staging
      locations = locations?.map(location =>
        setSupportedSchedulingMethods({
          location,
          requestFacilityIds,
          directFacilityIds,
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
export function getSiteIdFromFakeFHIRId(id) {
  return parseId(id).substr(0, 3);
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
