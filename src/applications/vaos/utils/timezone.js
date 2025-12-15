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

const GMT_TABLE_MAPPING = {
  'GMT+8': 'PHT', // Asia/Manila
  'GMT-11': 'ST', // Pacific/Pago_Pago
  'GMT+10': 'ChT', // Pacific/Guam, Pacific/Saipan
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
 * Function to map GMT timezone to abbreviation
 *
 * @export
 * @param {string} abbreviation - Timezone abbreviation that may be GMT format
 * @returns {string} - Mapped timezone abbreviation or original if not GMT
 */
export function mapGmtToAbbreviation(abbreviation) {
  if (abbreviation?.startsWith('GMT')) {
    return GMT_TABLE_MAPPING[abbreviation] || abbreviation;
  }
  return abbreviation;
}

/**
 * Function to return timezone.
 *
 * @export
 * @param {string} id - Facility id
 * @param {boolean} isUseBrowserTimezone - Flag to determine if browser timezone
 * should be used when facility id is not found.
 * @returns IANA Timezone name Example: 'America/Chicago' or browsers timezone which
 * could be GMT.
 */
export function getTimezoneByFacilityId(id, isUseBrowserTimezone = false) {
  if (!id) {
    if (isUseBrowserTimezone) {
      return mapGmtToAbbreviation(
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
    }

    return null;
  }

  // Check 3 digit facility/location ids
  if (timezones[id]) {
    return timezones[id];
  }

  // Check 5 digit facility/location ids
  const timezone = timezones[id.substring(0, 3)];
  if (isUseBrowserTimezone && !timezone) {
    // Default to browser timezone
    return mapGmtToAbbreviation(
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    );
  }

  return timezone;
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

  timeZoneAbbr = mapGmtToAbbreviation(timeZoneAbbr);

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
 * Function to return timezone description by timezone string
 *
 * @export
 * @param {string} timezone - The IANA timezone string (e.g., 'America/New_York')
 * @returns Timezone description Example: 'Central time (CT)'
 */
export function getTimezoneDescByTimeZoneString(timezone) {
  let abbreviation = formatInTimeZone(new Date(), timezone, 'z');
  abbreviation = mapGmtToAbbreviation(abbreviation);

  // Strip out middle char in abbreviation so we can ignore DST
  if (timezone.includes('America') || timezone.includes('Pacific')) {
    abbreviation = stripDST(abbreviation);
  }

  const label = TIMEZONE_LABELS[abbreviation];

  if (label) {
    return `${label} (${abbreviation})`;
  }

  return abbreviation;
}

/**
 * Function to return timezone abbreviation.
 *
 * @export
 * @param {string} id - Facility id
 * @param {boolean} isUseBrowserTimezone - Flag to determine if browser timezone
 * should be used when facility id is not found.
 * @returns Timezone abbreviation with daylight savings stripped. Example: 'CT'
 */
export function getTimezoneAbbrByFacilityId(id, isUseBrowserTimezone = false) {
  const matchingZone = getTimezoneByFacilityId(id, isUseBrowserTimezone);

  // If using browser timezone and we received a GMT value, return it directly
  if (isUseBrowserTimezone && matchingZone?.startsWith('GMT'))
    return matchingZone;

  // If no matching zone was found and we're allowed to use the browser timezone,
  // derive an abbreviation from the browser and strip DST
  if (isUseBrowserTimezone && !matchingZone) {
    return stripDST(mapGmtToAbbreviation(format(new Date(), 'z')));
  }

  if (!matchingZone) {
    return null;
  }

  let abbreviation = formatInTimeZone(new Date(), matchingZone, 'z');
  abbreviation = mapGmtToAbbreviation(abbreviation);

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
 * @param {boolean} isUseBrowserTimezone - Flag to determine if browser timezone
 * should be used when facility id is not found.
 * @returns Timezone description Example: Central time (CT)
 */
export function getTimezoneDescByFacilityId(id, isUseBrowserTimezone = false) {
  const abbreviation = getTimezoneAbbrByFacilityId(id, isUseBrowserTimezone);
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
  let abbreviation = format(new Date(), 'z');
  abbreviation = mapGmtToAbbreviation(abbreviation);

  return abbreviation || format(new Date(), 'z');
}

/**
 * Function to get formatted timezone abbreviation for a given date and timezone.
 *
 * @export
 * @param {string|Date} date - The date to format.
 * @param {string} timezone - The IANA timezone string (e.g., 'America/New_York').
 * @returns {string} - The formatted timezone abbreviation with DST stripped and GMTs replaced.
 */
export function getFormattedTimezoneAbbr(date, timezone) {
  return stripDST(
    mapGmtToAbbreviation(formatInTimeZone(new Date(date), timezone, 'zzz')),
  );
}
