import {
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_CARE,
  TYPES_OF_EYE_CARE,
  TYPES_OF_SLEEP_CARE,
  VHA_FHIR_ID,
} from '../../utils/constants';

/**
 * Transforms a facility object from the MFS v2 facilities endpoint into our
 * VAOS Location format
 *
 * @export
 * @param {VAFacility} facility A facility from the MFS v2 facilities endpoint
 * @returns {Location} A Location resource
 */
export function transformFacility(facility) {
  const id = facility.id.toUpperCase();
  return {
    resourceType: 'Location',
    id,
    vistaId: facility.vistaSite,
    name: facility.name,
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${facility.vistaSite}:${id}`,
      },
      {
        system: VHA_FHIR_ID,
        value: id,
      },
    ],
    telecom: [
      {
        system: 'phone',
        value: facility.phone?.main,
      },
    ],
    position: {
      longitude: facility.long,
      latitude: facility.lat,
    },
    address: {
      line: facility.physicalAddress.line,
      city: facility.physicalAddress.city,
      state: facility.physicalAddress.state,
      postalCode: facility.physicalAddress.postalCode,
    },
  };
}

/**
 * Transforms parent facilities from var-resources into Location objects
 *
 * @export
 * @param {Array<VARFacility>} parentFacilities A list of facilities from var-resources
 * @returns {Array<Location>} A list of Locations
 */
export function transformParentFacilitiesV2(facilities) {
  return facilities
    .filter(facility => {
      return facility.id === facility.vastParent;
    })
    .map(transformFacility);
}

/**
 * Transforms a list of MFS v2 facilities into a list of Locations
 *
 * @export
 * @param {Array<MFSFacility>} facilities A list of facilities from MFS v2 facilities endpoint
 * @returns {Array<Location>} A list of Location resources
 */
export function transformFacilitiesV2(facilities) {
  return facilities.map(transformFacility);
}

function getTypeOfCareIdFromV2(id) {
  const allTypesOfCare = [
    ...TYPES_OF_EYE_CARE,
    ...TYPES_OF_SLEEP_CARE,
    ...AUDIOLOGY_TYPES_OF_CARE,
    ...TYPES_OF_CARE,
  ];

  return allTypesOfCare.find(care => care.idV2 === id)?.id;
}

export function transformSettingsV2(settings) {
  return settings.map(setting => ({
    ...setting,
    services: setting.services.map(service => ({
      ...service,
      id: getTypeOfCareIdFromV2(service.id),
    })),
  }));
}
