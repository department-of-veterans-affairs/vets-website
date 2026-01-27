import {
  AUDIOLOGY_TYPES_OF_CARE,
  TYPES_OF_CARE,
  TYPES_OF_EYE_CARE,
  TYPES_OF_MENTAL_HEALTH,
  TYPES_OF_SLEEP_CARE,
  VHA_FHIR_ID,
} from '../../utils/constants';

import { arrayToObject } from '../../utils/data';

/**
 * Transforms a facility object from the MFS v2 facilities endpoint into our
 * VAOS Location format
 *
 * @export
 * @param {VAFacility} facility A facility from the MFS v2 facilities endpoint
 * @returns {Location} A Location resource
 */
export function transformFacilityV2(facility) {
  return {
    resourceType: 'Location',
    id: facility.id,
    vistaId: facility.vistaSite || facility.vista_site,
    name: facility.name,
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${facility.vistaSite || facility.vista_site}:${
          facility.id
        }`,
      },
      {
        system: VHA_FHIR_ID,
        value: facility.id,
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
      line: facility.physicalAddress?.line || facility.physical_address?.line,
      city: facility.physicalAddress?.city || facility.physical_address?.city,
      state:
        facility.physicalAddress?.state || facility.physical_address?.state,
      postalCode:
        facility.physicalAddress?.postalCode ||
        facility.physical_address?.postalCode,
    },
    website: facility.website,
  };
}

/**
 * Sets requestSupported and directSchedulingSupported in legacyVAR
 * for locations that are retrieved from the v1 facilities API.  This
 * also replaces the ids when running locally or on staging since there
 * is a mismatch between VAMF facility ids and the facilities API
 *
 * @export
 * @param {Object} params Parameters needed for fetching locations
 * @param {Location} params.location A location resource
 * @param {Array<Object>} params.settings An array of settings objects for a given location
 * @returns {Location} A Location resource
 */
export function setSupportedSchedulingMethods({ location, settings } = {}) {
  const { id } = location;

  const facilitySettings = settings.find(f => f.id === id);

  const { identifier } = location;
  const vhaIdentifier = location.identifier.find(i => i.system === VHA_FHIR_ID);

  if (!vhaIdentifier) {
    identifier.push({
      system: VHA_FHIR_ID,
      value: id,
    });
  }

  return {
    ...location,
    id,
    identifier,
    legacyVAR: {
      ...location.legacyVAR,
      settings: arrayToObject(facilitySettings?.services),
    },
  };
}

/**
 * Transforms a single vets-api PPMS provider format into a Location
 * resource
 *
 * @param {Object<PPMSProvider>} provider A PPMS provider
 * @returns {Array<Location>} A Location resource
 */

function transformCommunityProvider(provider) {
  return {
    id: provider.id,
    identifier: [{ system: 'PPMS', value: provider.uniqueId }],
    resourceType: 'Location',
    address: {
      line: [provider.address?.street],
      city: provider.address?.city,
      state: provider.address?.state,
      postalCode: provider.address?.zip || provider.address?.zipCode, // or providerZipCode????
    },
    providerName:
      provider.lastName &&
      `${provider.firstName || ''} ${provider.lastName || ''}`,
    practiceName: provider.practiceName,

    // TODO: Refactor!!!!
    name: provider.name || provider.practiceName,

    position: { longitude: provider.long, latitude: provider.lat },
    telecom: [{ system: 'phone', value: provider.caresitePhone }],
  };
}

/**
 * Transforms an array of vets-api PPMS provider format into an array of Location
 * resources
 *
 * @export
 * @param {Array<PPMSProvider>} providers A list of PPMS providers
 * @returns {Array<Location>} A list of Location resources
 */
export function transformCommunityProviders(providers) {
  return providers.map(provider => transformCommunityProvider(provider));
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
    .map(transformFacilityV2);
}

/**
 * Transforms a list of MFS v2 facilities into a list of Locations
 *
 * @export
 * @param {Array<MFSFacility>} facilities A list of facilities from MFS v2 facilities endpoint
 * @returns {Array<Location>} A list of Location resources
 */
export function transformFacilitiesV2(facilities) {
  return facilities.map(transformFacilityV2);
}

function getTypeOfCareIdFromV2(id) {
  const allTypesOfCare = [
    ...TYPES_OF_EYE_CARE,
    ...TYPES_OF_SLEEP_CARE,
    ...AUDIOLOGY_TYPES_OF_CARE,
    ...TYPES_OF_MENTAL_HEALTH,
    ...TYPES_OF_CARE,
  ];

  return allTypesOfCare.find(care => care.idV2 === id)?.id;
}

export function transformSettingsV2(settings, useVpg = false) {
  return settings.map(setting => ({
    ...setting,
    services: useVpg
      ? setting.vaServices.map(service => ({
          ...service,
          id: getTypeOfCareIdFromV2(service.clinicalServiceId),
        }))
      : setting.services.map(service => ({
          ...service,
          id: getTypeOfCareIdFromV2(service.id),
        })),
  }));
}
