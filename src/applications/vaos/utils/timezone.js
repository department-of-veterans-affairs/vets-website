import { format, formatInTimeZone } from 'date-fns-tz';
import timezones from './timezones.json';

const TIMEZONE_LABELS = {
  PHT: 'Philippine time',
  ET: 'Eastern time',
  CT: 'Central time',
  MT: 'Mountain time',
  PT: 'Pacific time',
  AKT: 'Alaska time',
  HT: 'Hawaii time',
  ST: 'Samoa time',
  ChT: 'Chamorro time',
  AT: 'Atlantic time',
};

/**
 * Function to strip out the middle character in timezone abbreviations
 *
 * @export
 * @param {string} stringWithAbbr - String containing timezone abbreviations
 * @returns {string} - String with stripped timezone abbreviations
 */
export function stripDST(stringWithAbbr) {
  // Extract timezone abbreviations from the string
  const matches = stringWithAbbr.match(/([PMCEHSA][DS]T|AK[DS]T|ChST)/g);

  if (matches && matches.length > 0) {
    // Process each timezone abbreviation in the string
    let result = stringWithAbbr;
    matches.forEach(match => {
      const stripped = match.replace('ST', 'T').replace('DT', 'T');
      result = result.replace(match, stripped);
    });
    return result;
  }

  return stringWithAbbr;
}

/**
 * Function to return timezone.
 *
 * @export
 * @param {string} id - Facility id
 * @returns IANA Timezone name Example: 'America/Chicago'
 */
export function getTimezoneByFacilityId(id) {
  if (!id) {
    return null;
  }

  if (timezones[id]) {
    return timezones[id];
  }

  return timezones[id.substring(0, 3)];
}

/**
 * Function to return timezone abbreviation.
 *
 * @export
 * @param {Object} appointment
 * @returns Timezone abbreviation with daylight savings time stripped. Example: 'CT'
 */
export function getTimezoneAbbrFromApi(appointment) {
  const appointmentTZ = appointment?.timezone;
  let timeZoneAbbr = appointmentTZ
    ? formatInTimeZone(new Date(), appointmentTZ, 'z')
    : null;

  // Strip out middle char in abbreviation so we can ignore DST
  if (
    appointmentTZ?.includes('America') ||
    appointmentTZ?.includes('Pacific')
  ) {
    timeZoneAbbr = stripDST(timeZoneAbbr);
  }
  return timeZoneAbbr;
}

/**
 * Function to return timezone abbreviation.
 *
 * @export
 * @param {string} id - Facility id
 * @returns Timezone abbreviation with daylight savings stripped. Example: 'CT'
 */
export function getTimezoneAbbrByFacilityId(id) {
  const matchingZone = getTimezoneByFacilityId(id);

  if (!matchingZone) {
    return null;
  }

  let abbreviation = formatInTimeZone(new Date(), matchingZone, 'z');

  // Strip out middle char in abbreviation so we can ignore DST
  if (matchingZone.includes('America') || matchingZone.includes('Pacific')) {
    abbreviation = stripDST(abbreviation);
  }

  return abbreviation;
}

/**
 * Function to return timezone description
 *
 * @export
 * @param {string} id - Facility id
 * @returns Timezone description Example: Central time (CT)
 */
export function getTimezoneDescByFacilityId(id) {
  const abbreviation = getTimezoneAbbrByFacilityId(id);
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return `${label} (${abbreviation})`;
  }

  return abbreviation;
}

/**
 * Function to return timezone label.
 *
 * @export
 * @param {string} abbreviation - Timezone abbreviation Example: 'CT'
 * @returns Timezone label Example: 'Central time'. Returns abbreviation if label is not found.
 */
export function getTimezoneNameFromAbbr(abbreviation) {
  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return label;
  }

  return abbreviation;
}

/**
 * Function to get user's timezone.
 *
 * @export
 * @returns User's timezone abbreviation Example: 'CST'
 */
export function getUserTimezoneAbbr() {
  return format(new Date(), 'z');
}
