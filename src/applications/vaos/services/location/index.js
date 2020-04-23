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
function parseOrganizationId(id) {
  return id.replace('Organization/var', '');
}

/**
 * Fetch facility information for the facilities in the given site
 *
 * @export
 * @param {Array} rootOrganizationId An id for the VistA site to pull child facilities for
 * @param {Array} parentOrganizationId An id for the parent organization of the facilities being pulled
 * @returns {Object} A FHIR searchset of Location resources
 */
export async function getLocations(
  rootOrganizationId,
  parentOrganizationId,
  typeOfCareId,
) {
  try {
    const parentFacilities = await getFacilitiesBySystemAndTypeOfCare(
      parseOrganizationId(rootOrganizationId),
      parseOrganizationId(parentOrganizationId),
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
