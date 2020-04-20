/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import { getParentFacilities } from '../../api';
import { mapToFHIRErrors } from '../../utils/fhir';
import transformParentFacilities from './transformer';

/**
 * Fetch details about the facilities given, typically the VistA sites
 * where a user is registered
 *
 * @export
 * @param {Array} siteIds A list of three digit site ids
 * @returns {Object} A FHIR searchset of Organization resources
 */
export async function getOrganizations(siteIds) {
  try {
    const parentFacilities = await getParentFacilities(siteIds);

    return transformParentFacilities(parentFacilities);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
