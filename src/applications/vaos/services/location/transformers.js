/**
 * @module services/Location/transformers
 */

import moment from 'moment';
import environment from 'platform/utilities/environment';
import { VHA_FHIR_ID } from '../../utils/constants';
import { arrayToObject, dedupeArray } from '../../utils/data';

/**
 * Transforms /vaos/systems/983/direct_scheduling_facilities?type_of_care_id=323&parent_code=983GB to
 * /Location?organization=Organization/983
 *
 * @export
 * @param {Array<VARFacility>} facilities A list of facilities from var-resources
 * @returns {Array<Location>} A FHIR searchset of Location resources
 */
export function transformDSFacilities(facilities) {
  return facilities.map(facility => ({
    resourceType: 'Location',
    id: facility.id,
    vistaId: facility.rootStationCode,
    identifier: [
      {
        system: VHA_FHIR_ID,
        value: facility.institutionCode,
      },
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${facility.rootStationCode}:${facility.id}`,
      },
    ],
    name: facility.authoritativeName,
    telecom: [],
    address: {
      line: [],
      city: facility.city,
      state: facility.stateAbbrev,
      postalCode: null,
    },
    legacyVAR: {
      institutionTimezone: facility.institutionTimezone,
      requestSupported: facility.requestSupported,
      directSchedulingSupported: facility.directSchedulingSupported,
    },
  }));
}

function isFacilityOpenAllDay(hours) {
  if (!hours) return false;

  // Remove all whitespace.
  const sanitizedOperatingHours = hours.replace(/\s/g, '');

  // Escape early if it is 'Sunrise - Sunset'.
  if (
    sanitizedOperatingHours.toLowerCase() === 'sunrise-sunset' ||
    sanitizedOperatingHours === '24/7'
  ) {
    return true;
  }

  return false;
}

function isFacilityClosed(hours) {
  if (!hours) return true;

  if (isFacilityOpenAllDay(hours)) {
    return false;
  }

  // Remove all whitespace.
  const sanitizedOperatingHours = hours.replace(/\s/g, '');

  // Derive if the hours are closed.
  return (
    sanitizedOperatingHours === '-' ||
    sanitizedOperatingHours.toLowerCase().includes('close')
  );
}

function parseHours(operatingHours) {
  if (!operatingHours) {
    return [null, null];
  }

  if (
    isFacilityOpenAllDay(operatingHours) ||
    isFacilityClosed(operatingHours)
  ) {
    return [null, null];
  }

  // Remove all whitespace.
  const sanitizedOperatingHours = operatingHours.replace(/\s/g, '');

  if (!sanitizedOperatingHours.includes('-')) {
    return [operatingHours, null];
  }

  // Derive the opening and closing hours.
  const [openingHour, closingHour] = sanitizedOperatingHours.split('-');

  // Format the hours based on 'hmmA' format.
  let formattedOpeningHour = moment(openingHour, 'hmmA').format('HH:mm');
  let formattedClosingHour = moment(closingHour, 'hmmA').format('HH:mm');

  // Attempt to format the hours based on 'h:mmA' if there's a colon.
  if (openingHour.includes(':')) {
    formattedOpeningHour = moment(openingHour, 'h:mmA').format('HH:mm');
  }
  if (closingHour.includes(':')) {
    formattedClosingHour = moment(closingHour, 'h:mmA').format('HH:mm');
  }

  // Derive the formatted operating hours.
  const hoursArray = [formattedOpeningHour, formattedClosingHour];

  // Return original string if invalid date.
  if (hoursArray[0].search(/Invalid date/i) === 0) {
    hoursArray[0] = null;
  }
  if (hoursArray[1].search(/Invalid date/i) === 0) {
    hoursArray[1] = null;
  }

  // Return the formatted operating hours.
  return hoursArray;
}

function transformOperatingHours(facilityHours) {
  return Object.entries(facilityHours || {})
    .filter(entry => !isFacilityClosed(entry[1]))
    .map(([day, hours]) => {
      const [openingTime, closingTime] = parseHours(hours);

      return {
        daysOfWeek: [day.toLowerCase().substr(0, 3)],
        allDay: isFacilityOpenAllDay(hours),
        openingTime,
        closingTime,
      };
    });
}

/**
 * Converts back from a real facility id to our test facility ids
 * in lower environments
 *
 * @param {String} facilityId - facility id to convert
 * @returns A facility id with either 442 or 552 replaced with 983 or 984
 */
function getTestFacilityId(facilityId) {
  if (facilityId && (!environment.isProduction() || window.Cypress)) {
    return facilityId.replace('442', '983').replace('552', '984');
  }

  return facilityId;
}

/**
 * Returns whether or not the facility has a COVID vaccine phone line
 *
 * @param {Location} facility A facility resource
 * @returns {Boolean} Whether or not the facility has a COVID vaccine phone line
 */
function hasCovidPhoneNumber(facility) {
  return !!facility.detailedServices?.find(
    service => service.name === 'COVID-19 vaccines',
  )?.appointmentPhones[0]?.number;
}

/**
 * Transforms a facility object from the VA facilities api into our
 * VAOS Location format
 *
 * @export
 * @param {VAFacility} facility A facility from the VA facilities api
 * @returns {Location} A FHIR Location resource
 */
export function transformFacility(facility) {
  const id = getTestFacilityId(facility.uniqueId);
  const facilityObj = {
    resourceType: 'Location',
    id,
    vistaId: id.substr(0, 3),
    identifier: [
      {
        system: 'http://med.va.gov/fhir/urn',
        value: `urn:va:division:${id.substr(0, 3)}:${id}`,
      },
      {
        system: VHA_FHIR_ID,
        value: id,
      },
    ],
    name: facility.name,
    telecom: [
      {
        system: 'phone',
        value: facility.phone?.main,
      },
    ],
    address: facility.address?.physical
      ? {
          line: [
            facility.address.physical.address1,
            facility.address.physical.address2,
            facility.address.physical.address3,
          ].filter(line => !!line),
          city: facility.address.physical.city,
          state: facility.address.physical.state,
          postalCode: facility.address.physical.zip,
        }
      : null,
    position: {
      longitude: facility.long,
      latitude: facility.lat,
    },
    hoursOfOperation: transformOperatingHours(facility.hours),
  };

  if (hasCovidPhoneNumber(facility)) {
    facilityObj.telecom.push({
      system: 'covid',
      value: facility.detailedServices?.find(
        service => service.name === 'COVID-19 vaccines',
      )?.appointmentPhones[0]?.number,
    });
  }

  return facilityObj;
}

/**
 * Transform an ATLAS facility from VVS (via MAS) to our Location format
 *
 * @export
 * @param {VARAtlasFacility} tasInfo The tasInfo object from legacyVAR
 * @returns {Location} A FHIR Location resource
 */
export function transformATLASLocation(tasInfo) {
  const { address, siteCode } = tasInfo;
  const {
    city,
    longitude,
    latitude,
    state,
    streetAddress,
    zipCode: postalCode,
  } = address;
  return {
    resourceType: 'Location',
    id: siteCode,
    address: {
      line: [streetAddress],
      city,
      state,
      postalCode,
    },
    position: {
      longitude,
      latitude,
    },
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
      settings: arrayToObject(facilitySettings.services),
    },
  };
}

/**
 * Transforms a list of facilities api facilities into a list of Locations
 *
 * @export
 * @param {Array<VAFacility>} facilities A list of facilities from the facilities api
 * @returns {Array<Location>} A list of Location resources
 */
export function transformFacilities(facilities) {
  return facilities.map(transformFacility);
}

/**
 * Transforms a single vets-api PPMS provider format into a Location
 * resource
 *
 * @export
 * @param {Object<PPMSProvider>} provider A PPMS provider
 * @returns {Array<Location>} A Location resource
 */

export function transformCommunityProvider(provider) {
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
 * Transforms the list of request and direct scheduling settings from VATS
 * into a combined settings object
 *
 * @export
 * @param {Array<Array>} [settings=[[],[]]] The array of settings from MFS v1
 * @returns {Array<FacilitySettings>} A list of settings for a VA facility
 */
export function transformSettings([request = [], direct = []]) {
  // Trying to handle if we get different sets of facilities from each setttings list
  // by converting the lists to objects and creating a unique list of ids
  const directSettings = arrayToObject(direct);
  const requestSettings = arrayToObject(request);
  const facilityIds = dedupeArray([
    ...direct.map(d => d.id),
    ...request.map(r => r.id),
  ]);

  return facilityIds.map(id => {
    // Similar to above, trying to handle us potentially getting different sets of
    // types of care between the two types of settings
    const serviceIds = dedupeArray([
      ...(directSettings[id]?.coreSettings.map(d => d.id) || []),
      ...(requestSettings[id]?.requestSettings.map(r => r.id) || []),
    ]);
    const requestServiceSettings = arrayToObject(
      requestSettings[id]?.requestSettings,
    );
    const directServiceSettings = arrayToObject(
      directSettings[id]?.coreSettings,
    );

    return {
      id,
      services: serviceIds.map(serviceId => {
        const directCareSettings = directServiceSettings[serviceId];
        const requestCareSettings = requestServiceSettings[serviceId];

        return {
          id: serviceId,
          name:
            requestCareSettings?.typeOfCare || directCareSettings?.typeOfCare,
          direct: {
            enabled: !!directCareSettings?.patientHistoryRequired,
            patientHistoryRequired:
              directCareSettings?.patientHistoryRequired?.toLowerCase() ===
              'yes',
            patientHistoryDuration: directCareSettings?.patientHistoryDuration,
          },
          request: {
            enabled: !!requestCareSettings?.patientHistoryRequired,
            patientHistoryRequired:
              requestCareSettings?.patientHistoryRequired?.toLowerCase() ===
              'yes',
            patientHistoryDuration: requestCareSettings?.patientHistoryDuration,
            submittedRequestLimit: requestCareSettings?.submittedRequestLimit,
          },
        };
      }),
    };
  });
}

/**
 * Transforms parent facilities from var-resources into Location objects
 *
 * @export
 * @param {Array<VARFacility>} parentFacilities A list of parent facilities from var-resources
 * @returns {Array<Location>} A list of Locations
 */
export function transformParentFacilities(parentFacilities) {
  return parentFacilities.map(facility => {
    return {
      resourceType: 'Location',
      id: facility.id,
      vistaId: facility.rootStationCode,
      name: facility.authoritativeName,
      address: {
        line: [],
        city: facility.city,
        state: facility.stateAbbrev,
        postalCode: null,
      },
    };
  });
}
