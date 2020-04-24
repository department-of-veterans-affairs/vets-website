/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import { getFacilitiesBySystemAndTypeOfCare } from '../../api';
import { mapToFHIRErrors } from '../../utils/fhir';
import { transformFacilities } from './transformers';

/*
 * This is used to parse the fake FHIR ids we create for organizations
 */
function parseId(id) {
  return id.replace('var', '');
}

/**
 * Fetch facility information for the facilities in the given site
 *
 * @export
 * @param {Object} locationsParams Parameters needed for fetching locations
 * @param {Array} locationParams.systemId An id for the VistA site to pull child facilities for
 * @param {Array} locationParams.parentId An id for the parent organization of the facilities being pulled
 * @param {Array} locationParams.typeOfCareId An id for the type of care to check for the chosen organization
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getLocations({ systemId, parentId, typeOfCareId }) {
  try {
    const parentFacilities = await getFacilitiesBySystemAndTypeOfCare(
      parseId(systemId),
      parseId(parentId),
      typeOfCareId,
    );

    return transformFacilities(parentFacilities);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
