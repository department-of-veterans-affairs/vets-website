/**
 * Transforms /vaos/systems/983/direct_scheduling_facilities?type_of_care_id=323&parent_code=983GB to
 * /Location?organization=Organization/var983
 *
 * @export
 * @param {Array} facilities A list of facilities from var-resources
 * @returns {Object} A FHIR searchset of Location resources
 */
export function transformDSFacilities(facilities) {
  return facilities.map(facility => ({
    resourceType: 'Location',
    id: `var${facility.id}`,
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${facility.rootStationCode}:${facility.id}`,
      },
    ],
    name: facility.authoritativeName,
    telecom: [],
    address: [
      {
        line: [],
        city: facility.city,
        state: facility.stateAbbrev,
        postalCode: null,
      },
    ],
    legacyVAR: {
      institutionTimezone: facility.institutionTimezone,
      requestSupported: facility.requestSupported,
      directSchedulingSupported: facility.directSupported,
    },
    managingOrganization: {
      reference: `Organization/var${root.parentStationCode}`,
    },
  }));
}

/**
 * Transforms /facilities/va/vha_983 to
 * /Location/var983
 *
 * @export
 * @param {Object} facility A facility from the VA facilities api
 * @returns {Object} A FHIR Location resource
 */
export function transformFacility(facility) {
  return {
    resourceType: 'Location',
    id: `var${facility.uniqueId}`,
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${facility.uniqueId.substr(0, 3)}:${
          facility.uniqueId
        }`,
      },
    ],
    name: facility.name,
    telecom: [
      {
        system: 'phone',
        value: facility.phone?.main,
      },
    ],
    address: [
      {
        line: [
          facility.address.physical.address1,
          facility.address.physical.address2,
          facility.address.physical.address3,
        ].filter(line => !!line),
        city: facility.address.physical.city,
        state: facility.address.physical.state,
        postalCode: facility.address.physical.zip,
      },
    ],
    managingOrganization: {
      reference: `Organization/var${facility.uniqueId.substr(0, 3)}`,
    },
  };
}

/**
 * Transforms /facilities/va?ids=983,984
 * /Location?identifier=983,984
 *
 * @export
 * @param {Array} facilities A list of facilities from var-resources
 * @returns {Object} A FHIR searchset of Location resources
 */
export function transformFacilities(facilities) {
  return facilities.map(transformFacility);
}
