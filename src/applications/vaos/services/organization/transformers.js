/**
 * @module services/Organization/transformers
 */

import { VHA_FHIR_ID } from '../../utils/constants';

/**
 * Transforms /vaos/facilities?facility_codes[]=983&facility_codes[]=984 to
 * /Organization?identifier=983,984
 *
 * @export
 * @param {Array<VARFacility>} parentFacilities A list of parent facilities from var-resources
 * @returns {Array<Organization>} A list of Organization resources
 */
export function transformParentFacilities(parentFacilities) {
  return parentFacilities.map(facility => {
    let partOf;

    // We probably won't need partOf when dealing with the FHIR apis, but
    // it depends on how the FHIR calls work
    if (facility.rootStationCode !== facility.id) {
      partOf = {
        reference: `Organization/${facility.rootStationCode}`,
      };
    }

    return {
      resourceType: 'Organization',
      id: facility.id,
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
  });
}
