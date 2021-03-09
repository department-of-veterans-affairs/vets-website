/**
 * @module services/Location/transformers
 */

import moment from 'moment';
import environment from 'platform/utilities/environment';
import { VHA_FHIR_ID } from '../../utils/constants';

/**
 * Transforms /vaos/systems/983/direct_scheduling_facilities?type_of_care_id=323&parent_code=983GB to
 * /Location?organization=Organization/983
 *
 * @export
 * @param {Array} facilities A list of facilities from var-resources
 * @returns {Object} A FHIR searchset of Location resources
 */
export function transformDSFacilities(facilities) {
  return facilities.map(facility => ({
    resourceType: 'Location',
    id: facility.id,
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
    managingOrganization: {
      reference: `Organization/${facility.parentStationCode}`,
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
 * @export
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
 * Transforms /facilities/va/vha_983 to
 * /Location/983
 *
 * @export
 * @param {Object} facility A facility from the VA facilities api
 * @returns {Object} A FHIR Location resource
 */
export function transformFacility(facility) {
  const id = getTestFacilityId(facility.uniqueId);
  return {
    resourceType: 'Location',
    id,
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
    managingOrganization: {
      reference: `Organization/${id.substr(0, 3)}`,
    },
  };
}

/**
 * Transform an ATLAS facility from LegacyVAR to a FHIR location resource
 * @export
 * @param {Object} tasInfo The tasInfo object from legacyVAR
 * @returns {Object} A FHIR Location resource
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
 * @param {Object} params.location A location resource
 * @param {Array} params.requestSupportedFacilities An array of location ids that support requests for a particular type of care
 * @param {Array} params.directSupportedFacilities An array of location ids that support direct scheduling for a particular type of care
 * @returns {Array} A location resource
 */
export function setSupportedSchedulingMethods({
  location,
  requestFacilities,
  directFacilities,
} = {}) {
  const id = location.id;
  const requestSupported = {};
  const directSchedulingSupported = {};

  const facilityRequestSettings = requestFacilities.find(
    facility => facility.id === id,
  )?.requestSettings;
  const facilityCoreSettings = directFacilities.find(
    facility => facility.id === id,
  )?.coreSettings;

  if (facilityRequestSettings) {
    facilityRequestSettings.forEach(typeOfCare => {
      requestSupported[typeOfCare.id] = !!typeOfCare.patientHistoryRequired;
    });
  }

  if (facilityCoreSettings) {
    facilityCoreSettings.forEach(typeOfCare => {
      directSchedulingSupported[
        typeOfCare.id
      ] = !!typeOfCare.patientHistoryRequired;
    });
  }

  const identifier = location.identifier;
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
      requestSupported,
      directSchedulingSupported,
    },
    managingOrganization: {
      reference: location.managingOrganization?.reference,
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

export function transformCommunityProviders(providers) {
  return providers.map(provider => {
    return {
      id: provider.id,
      identifier: [
        {
          system: 'PPMS',
          value: provider.uniqueId,
        },
      ],
      resourceType: 'Location',
      address: {
        line: [provider.address.street],
        city: provider.address.city,
        state: provider.address.state,
        postalCode: provider.address.zip,
      },
      name: provider.name,
      position: {
        longitude: provider.long,
        latitude: provider.lat,
      },
      telecom: [
        {
          system: 'phone',
          value: provider.caresitePhone,
        },
      ],
    };
  });
}
