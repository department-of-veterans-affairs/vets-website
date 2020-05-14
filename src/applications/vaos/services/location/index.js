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
 * @param {Array} locationParams.rootOrgId An id for the organization of the VistA site to pull child facilities for
 * @param {Array} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {Array} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getSupportedLocationsByTypeOfCare({
  rootOrgId,
  parentId,
  typeOfCareId,
}) {
  try {
    const parentFacilities = await getFacilitiesBySystemAndTypeOfCare(
      parseId(rootOrgId),
      parseId(parentId),
      typeOfCareId,
    );

    return transformDSFacilities(
      // Doing this here because the FHIR service will return only supported facilities
      parentFacilities.filter(
        f => f.directSchedulingSupported || f.requestSupported,
      ),
    );
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
