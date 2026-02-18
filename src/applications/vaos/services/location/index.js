/**
 * @module services/Location
 */
/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */

import { mapToFHIRErrors } from '../utils';

import { VHA_FHIR_ID } from '../../utils/constants';
import { calculateBoundingBox } from '../../utils/address';
import {
  getSchedulingConfigurations,
  getFacilities,
  getFacilityById,
  getCommunityCareFacilities,
} from '../vaos';
import {
  transformParentFacilitiesV2,
  transformFacilitiesV2,
  transformSettingsV2,
  transformFacilityV2,
  setSupportedSchedulingMethods,
  transformCommunityProviders,
} from './transformers';
import { getRealFacilityId } from '../../utils/appointment';

/**
 * Fetch list of facilities
 *
 * @export
 * @async
 * @param {Object} locationParams Parameters needed for fetching locations
 * @param {Array<string>} locationParams.facilityIds A list of va facility ids to fetch
 * @returns {Array<Location>} A FHIR searchset of Location resources
 */
export async function getLocations({
  facilityIds,
  children = false,
  sortByRecentLocations = false,
}) {
  try {
    const facilities = await getFacilities(
      facilityIds,
      children,
      sortByRecentLocations,
    );

    return transformFacilitiesV2(facilities);
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
 * @param {Object} locationParams Parameters needed for fetching locations
 * @param {Array<string>} locationParams.facilityId An id for the facility to fetch info for
 * @returns {Location} A FHIR Location resource
 */
export async function getLocation({ facilityId }) {
  try {
    const facility = await getFacilityById(facilityId);

    return transformFacilityV2(facility);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Returns the VAOS settings for the included sites and their children
 *
 * @export
 * @async
 * @param {Object} params
 * @param {Array<string>} params.siteIds The vista site ids of the facilities we want to fetch
 * @param {boolean} params.useVpg Whether to use VPG-specific scheduling configuration
 * @returns {Array<FacilitySettings>} An array of facility settings
 */
export async function getLocationSettings({ siteIds, useVpg }) {
  try {
    const settings = await getSchedulingConfigurations(siteIds);
    return transformSettingsV2(settings, useVpg);
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
 * @param {Array<string>} params.siteIds A list of 3 digit site ids to retrieve the settings for
 * @param {boolean} [params.sortByRecentLocations=false] Whether to sort the locations by recent visits
 * @param {boolean} [params.removeFacilityConfigCheck=false] Whether to skip the facility configurations endpoint check and use eligibility from the patient eligibility API SOT only
 * @returns {Array<Location>} An array of Locations with settings included
 */
export async function getLocationsByTypeOfCareAndSiteIds({
  siteIds,
  sortByRecentLocations = false,
  removeFacilityConfigCheck = false,
  useVpg = false,
}) {
  try {
    let locations = [];
    let settings = [];

    locations = await getLocations({
      facilityIds: siteIds,
      children: true,
      sortByRecentLocations,
    });

    if (!removeFacilityConfigCheck) {
      const uniqueIds = locations.map(location => location.id);
      settings = await getLocationSettings({ siteIds: uniqueIds, useVpg });
    }

    locations = locations?.map(location =>
      setSupportedSchedulingMethods({
        location,
        settings,
      }),
    );
    if (sortByRecentLocations) {
      return locations;
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
 * Pulls the VistA id from an Location resource
 *
 * @export
 * @param {Location} location The location to get an id for
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
 * Returns formatted address from facility details object
 *
 * @param {Location} facility A location, or object with an Address field
 * @returns {string} The address, formatted as a string
 */
export function formatFacilityAddress(facility) {
  if (
    facility?.address?.line?.length > 0 &&
    facility?.address?.city &&
    facility?.address?.state &&
    facility?.address?.postalCode
  ) {
    return `${facility.address.line.filter(Boolean).join(', ')}, ${
      facility.address.city
    }, ${facility.address.state} ${facility.address.postalCode}`;
  }

  return '';
}

/**
 * Returns facility phone number.
 *
 * @export
 * @param {Location} facility The location to find the phone number of
 * @returns {string} Location phone number.
 */
export function getFacilityPhone(facility) {
  return facility?.telecom?.find(tele => tele.system === 'phone')?.value;
}

/**
 * Fetch community care providers by location and type of care
 *
 * @export
 * @async
 * @param {Object} locationParams Parameters needed for fetching providers
 * @param {VAFacilityAddress} locationParams.address The address in VA Profile format to search nearby
 * @param {Object} locationParams.typeOfCare Type of care data to use when searching for providers
 * @param {Number} locationParams.radius The radius to search for providers within, defaulted to 60
 * @param {Number} locationParams.maxResults The max number of results to return from the search
 * @returns {Array<Location>} A FHIR searchset of Location resources
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

/**
 * Fetch the locations associated with the given VistA site ids that are
 * marked as VAST parent locations
 *
 * @export
 * @async
 * @param {Object} params
 * @param {Array<string>} params.siteIds A list of three digit VistA site ids
 * @returns {Array<Location>} A list of parent Locations
 */
export async function fetchParentLocations({ siteIds }) {
  try {
    const sortFacilitiesMethod = (a, b) => {
      // a.name comes 1st
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      // b.name comes 1st
      if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      // a.name and b.name are equal
      return 0;
    };

    const facilities = await getFacilities(siteIds, true);
    return transformParentFacilitiesV2(facilities).sort(sortFacilitiesMethod);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}

/**
 * Fetch a list of locations supporting Community Care requests from
 * a given list of locations
 *
 * @export
 * @param {Object} params
 * @param {Array<Location>} params.locations The locations to find CC support at
 * @returns {Array<Location>} A list of locations that support CC requests
 */
export async function fetchCommunityCareSupportedSites({ locations }) {
  const facilityConfigs = await getSchedulingConfigurations(
    locations.map(location => location.id),
    true,
  );

  return locations.filter(location =>
    facilityConfigs.some(
      facilityConfig => facilityConfig.facilityId === location.id,
    ),
  );
}

/**
 * Returns true if a location is associated with one of the provided
 * Cerner site ids
 *
 * @export
 * @param {string} locationId The location id to check
 * @param {Array<string>} [cernerSiteIds=[]] A list of Cerner site ids to check against
 * @returns {Boolean} Returns true if locationId starts with any of the Cerner site ids
 */
export function isCernerLocation(locationId, cernerSiteIds = []) {
  return cernerSiteIds.some(cernerId => {
    return getRealFacilityId(locationId)?.startsWith(
      getRealFacilityId(cernerId),
    );
  });
}

/**
 * Returns true if location supports the given type of care
 *
 * @export
 * @param {Location} location The location to check
 * @param {string} typeOfCareId The type of care id to check against
 * @param {Array<string>} [cernerSiteIds=[]] The list of Cerner sites, because Cerner sites
 *   are active for all types of care
 * @param {boolean} [removeFacilityConfigCheck=false] Whether to skip the facility configurations endpoint check and use eligibility from the patient eligibility API SOT only
 * @returns {Boolean} True if the location supports the type of care (or is a Cerner site)
 */
export function isTypeOfCareSupported(
  location,
  typeOfCareId,
  cernerSiteIds = [],
  removeFacilityConfigCheck = false,
) {
  const setting = location.legacyVAR.settings[typeOfCareId];
  return (
    removeFacilityConfigCheck ||
    // Check old format (direct.enabled / request.enabled)
    setting?.direct?.enabled ||
    setting?.request?.enabled ||
    // Check VPG format (bookedAppointments / apptRequests)
    setting?.bookedAppointments ||
    setting?.apptRequests ||
    isCernerLocation(location.id, cernerSiteIds)
  );
}
