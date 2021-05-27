/**
 * @module services/Organization
 */

import { getParentFacilities } from '../var';
import { VHA_FHIR_ID } from '../../utils/constants';
import { transformParentFacilities } from './transformers';
import { mapToFHIRErrors } from '../utils';

/**
 * @summary
 * A parent site object, very similar to the Location format
 *
 * @typedef {Object} Organization
 *
 * @global
 * @property {string} id The id of the parent site, either an sta3n or sta6aid
 * @property {Array} identifier TODO
 * @property {string} name The name of the parent site
 * @property {Array<Address>} address The parent site's address, though for sites pulled
 *   from var-resources, there is no street
 * @property {Object} partOf If this parent site is an integrated site and isn't a root
 *   VistA instance, this will point to the VistA instance
 * @property {string} partOf.reference Reference to VistA site, in Organization/<site id> format
 */

/**
 * Fetch details about the facilities given, typically the VistA sites
 * where a user is registered
 *
 * @export
 * @async
 * @param {Object} params
 * @param {Array<string>} params.siteIds A list of three digit site ids
 * @returns {Array<Organization>} A list of Organization resources
 */
export async function getOrganizations({ siteIds }) {
  try {
    const parentFacilities = await getParentFacilities(siteIds);

    return transformParentFacilities(parentFacilities).sort((a, b) => {
      // a.name comes 1st
      if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
      // b.name comes 1st
      if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
      // a.name and b.name are equal
      return 0;
    });
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
 * @param {Organization} organization The organization to get an id for
 * @returns {string} Three digit VistA id
 */
export function getSiteIdFromOrganization(organization) {
  return organization?.identifier.find(id => id.system === VHA_FHIR_ID)?.value;
}

/**
 * Returns the root organization of a given id
 * Assumes that the list of orgs always includes the root and that there
 * are only two levels of nesting
 *
 * @export
 * @param {Array<Organization>} organizations List of organizations
 * @param {string} organizationId Id of the organization to find the root for
 * @returns {Organization} The organization data for the chosen id or its parent
 */
export function getRootOrganization(organizations, organizationId) {
  let organization = organizations?.find(
    parent => parent.id === organizationId,
  );

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
 * @param {Array<Organization>} organizations The list of organizations to search
 * @param {string} siteId The site id to use
 * @returns {Organization} The matching organization
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
 * @param {Array<Organization>} organizations Parent organizations
 * @param {string} organizationId Chosen parent organization
 * @returns {string} The organization id
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
