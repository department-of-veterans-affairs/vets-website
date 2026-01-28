import { formatInTimeZone } from 'date-fns-tz';
// TODO: move these functions to platform folder to share with VAOS

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
 * Function to return browser timezone
 *
 * @export
 * @returns {string} - Browser timezone in IANA format (e.g., 'America/New_York')
 */
export const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
