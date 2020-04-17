/*
 * Functions in here should map a var-resources API request to a similar response from
 * a FHIR resource request
 */
import { VHA_FHIR_ID } from '../utils/constants';
import { getParentFacilities } from '../api';
import { mapToFHIRErrors } from '../utils/fhir';

/**
 * Maps /vaos/facilities?facility_codes[]=983&facility_codes[]=984 to
 * /Organization?identifier=983,984
 *
 * @param {Array} parentFacilities A list of parent facilities from var-resources
 * @returns {Object} A FHIR searchset of Organization resources
 */
export function mapParentFacilities(parentFacilities) {
  return {
    resourceType: 'Bundle',
    id: 'fake-id',
    type: 'searchset',
    total: parentFacilities.length,
    entry: parentFacilities.map(facility => {
      let partOf;

      // We probably won't need partOf when dealing with the FHIR apis, but
      // it depends on how the FHIR calls work
      if (facility.rootStationCode !== facility.id) {
        partOf = {
          reference: `Organization/var${facility.rootStationCode}`,
        };
      }

      return {
        resourceType: 'Organization',
        id: `var${facility.id}`,
        identifier: [
          {
            system: VHA_FHIR_ID,
            value: facility.id,
          },
        ],
        active: true,
        name: facility.authoritativeName,
        address: [
          {
            line: [],
            city: facility.city,
            state: facility.stateAbbrev,
            postalCode: null,
          },
        ],
        partOf,
      };
    }),
  };
}

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

    return mapParentFacilities(parentFacilities);
  } catch (e) {
    if (e.errors) {
      throw mapToFHIRErrors(e.errors);
    }

    throw e;
  }
}
