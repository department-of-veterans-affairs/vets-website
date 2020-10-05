import moment from 'moment';
import { VHA_FHIR_ID } from '../../utils/constants';
import environment from 'platform/utilities/environment';

/*
 * This is used to parse the fake FHIR ids we create for organizations
 */
function parseId(id) {
  return id.replace('var', '');
}

/**
 * On localhost and staging, there is a mismatch between the
 * facilityIds that we use.  The new appointment flow mainly uses
 * VAMF IDs.  This converts the Facilities API ids to VAMF IDs
 *
 * @param {String} facilityId a facility id
 */
function getFakeFacilityId(facilityId) {
  if (!environment.isProduction() && facilityId) {
    return facilityId.replace('442', '983').replace('552', '984');
  }

  return facilityId;
}

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
      reference: `Organization/var${facility.parentStationCode}`,
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
      reference: `Organization/var${facility.uniqueId.substr(0, 3)}`,
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
 * @param {Array} params.requestFacilityIds An array of location ids that support requests for a particular type of care
 * @param {Array} params.directFacilityIds An array of location ids that support direct scheduling for a particular type of care
 * @returns {Array} A location resource
 */
export function setSupportedSchedulingMethods({
  location,
  requestFacilityIds,
  directFacilityIds,
} = {}) {
  const id = getFakeFacilityId(location.id);

  const requestSupported = requestFacilityIds.some(
    facilityId => `var${facilityId}` === id,
  );
  const directSchedulingSupported = directFacilityIds.some(
    facilityId => `var${facilityId}` === id,
  );

  const identifier = location.identifier;
  const vhaIdentifier = location.identifier.find(i => i.system === VHA_FHIR_ID);

  if (!vhaIdentifier) {
    identifier.push({
      system: VHA_FHIR_ID,
      value: parseId(id),
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
      reference: getFakeFacilityId(location.managingOrganization?.reference),
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
