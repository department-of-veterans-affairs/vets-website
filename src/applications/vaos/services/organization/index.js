/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import { getParentFacilities } from '../../api';
import { mapToFHIRErrors } from '../../utils/fhir';
import { VHA_FHIR_ID } from '../../utils/constants';
import { transformParentFacilities } from './transformers';

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
/**
 * Pulls the VistA id from an Organization resource
 *
 * @export
 * @param {Object} organization The organization to get an id for
 * @returns {String} Three digit VistA id
 */
export function getSiteIdFromOrganization(organization) {
  return organization.identifier.find(id => id.system === VHA_FHIR_ID)?.value;
}

/**
 * Returns the root organization of a given id
 * Assumes that the list of orgs always includes the root and that there
 * are only two levels of nesting
 *
 * @export
 * @param {Array} organizations List of organizations
 * @param {String} organizationId Id of the organization to find the root for
 * @returns {Object} The organization data for the chosen id or its parent
 */
export function getRootOrganization(organizations, organizationId) {
  let organization = organizations.find(parent => parent.id === organizationId);

  if (organization?.partOf) {
    const partOfId = organization.partOf.reference.split('/')[1];
    organization = organizations.find(parent => parent.id === partOfId);
  }

  return organization;
}

/**
 * Returns the organization given a VistA site id
 *
 * @export
 * @param {Array} organizations The list of organizations to search
 * @param {String} siteId The site id to use
 * @returns {Object} The matching organization
 */
export function getOrganizationBySiteId(organizations, siteId) {
  return organizations.find(org =>
    org.identifier.some(id => id.value === siteId),
  );
}
/**
 * Returns the root site id given a list of organizations and the parent organization
 *
 * @export
 * @param {Array} organizations Parent organizations
 * @param {String} organizationId Chosen parent organization
 * @returns {String} The organization id
 */
export function getIdOfRootOrganization(organizations, organizationId) {
  const parentOrg = organizations.find(parent => parent.id === organizationId);
  let rootOrg;

  if (parentOrg.partOf) {
    const partOfId = parentOrg.partOf.reference.split('/')[1];
    rootOrg = organizations.find(parent => parent.id === partOfId);
  } else {
    rootOrg = parentOrg;
  }

  if (!rootOrg) {
    return parentOrg.partOf.reference.replace('Organization/', '');
  }

  return rootOrg.id;
}
