/**
 * Transforms /vaos/systems/983/direct_scheduling_facilities?type_of_care_id=323&parent_code=983GB to
 * /Location?organization=Organization/var983
 *
 * @export
 * @param {Array} facilities A list of facilities from var-resources
 * @returns {Object} A FHIR searchset of Location resources
 */
export function transformFacilities(facilities) {
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
