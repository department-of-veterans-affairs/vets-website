/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import {
  getFacilitiesBySystemAndTypeOfCare,
  getFacilityInfo,
  getFacilitiesInfo,
} from '../../api';
import { mapToFHIRErrors } from '../../utils/fhir';
import {
  transformDSFacilities,
  transformFacilities,
  transformFacility,
} from './transformers';

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
 * @param {Array} locationParams.systemId An id for the VistA site to pull child facilities for
 * @param {Array} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {Array} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getLocationsByTypeOfCare({
  systemId,
  parentId,
  typeOfCareId,
}) {
  try {
    const parentFacilities = await getFacilitiesBySystemAndTypeOfCare(
      parseId(systemId),
      parseId(parentId),
      typeOfCareId,
    );

    return transformDSFacilities(parentFacilities);
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
