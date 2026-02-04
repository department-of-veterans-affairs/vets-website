import {
  addHours,
  subHours,
  subMinutes,
  addSeconds,
  format as dateFnsFormat,
  parseISO,
  isValid,
} from 'date-fns';
import { formatInTimeZone, format } from 'date-fns-tz';

/**
 * Format a FHIR dateTime string as a "local datetime" string, by stripping off the time zone
 * information and formatting what's left. FHIR allows only:
 *   - YYYY
 *   - YYYY-MM
 *   - YYYY-MM-DD
 *   - YYYY-MM-DDThh:mm:ss(.sss)(Z|±HH:MM)
 *
 * See: https://hl7.org/fhir/R4/datatypes.html#dateTime
 *
 * @param {String} isoString FHIR dateTime string, e.g. 2017-08-02T09:50:57-04:00, 2000-08-09
 * @param {String} fmt defaults to 'MMMM d, yyyy, h:mm a', ONLY applied to full dateTime strings
 * @returns {String} a formatted datetime, e.g. August 2, 2017, 9:50 a.m., or null for bad inputs
 */
export function dateFormatWithoutTimezone(
  isoString,
  fmt = 'MMMM d, yyyy, h:mm a',
) {
  if (!isoString || typeof isoString !== 'string') return null;

  // 1) Year-only: YYYY
  if (/^\d{4}$/.test(isoString)) {
    return isoString;
  }

  // 2) Year+month: YYYY-MM
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(isoString)) {
    const d = parseISO(`${isoString}-01`);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM yyyy');
  }

  // 3) Full date: YYYY-MM-DD
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(isoString)) {
    const d = parseISO(isoString);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM d, yyyy');
  }

  // 4) Date-time (must include seconds + TZ): strip off exactly "Z" or "+HH:MM"
  const stripped = isoString.replace(/(Z|[+-]\d{2}:\d{2})$/, '');

  // 5) Handle leap-second (":60" -> ":59")
  const fixedLeap = stripped.replace(/:60(\.\d+)?$/, ':59$1');

  const dt = parseISO(fixedLeap);
  if (!isValid(dt)) return null;

  return dateFnsFormat(dt, fmt)
    .replace(/\bAM\b/g, 'a.m.')
    .replace(/\bPM\b/g, 'p.m.');
}

/**
 * Format a UTC (or offset) ISO dateTime string in the user's local timezone with
 * timezone abbreviation. Use for unified vitals (SCDF) where the API sends UTC.
 * FHIR dateTime: YYYY-MM-DDThh:mm:ss(.sss)(Z|±HH:MM)
 *
 * @param {String} isoString ISO dateTime string, e.g. 2024-11-14T18:19:23Z
 * @param {String} fmt defaults to 'MMMM d, yyyy, h:mm a'
 * @param {String} [timeZone] IANA timezone (e.g. 'America/New_York'); if omitted, uses browser's timezone
 * @returns {String} e.g. "November 14, 2024, 1:19 p.m. EST", or null for bad inputs
 */
export function formatDateTimeInUserTimezone(
  isoString,
  fmt = 'MMMM d, yyyy, h:mm a',
  timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
) {
  if (!isoString || typeof isoString !== 'string') return null;

  // Year-only: YYYY
  if (/^\d{4}$/.test(isoString)) {
    return isoString;
  }

  // Year+month: YYYY-MM
  if (/^\d{4}-(0[1-9]|1[0-2])$/.test(isoString)) {
    const d = parseISO(`${isoString}-01`);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM yyyy');
  }

  // Date-only: YYYY-MM-DD
  if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(isoString)) {
    const d = parseISO(isoString);
    if (!isValid(d)) return null;
    return dateFnsFormat(d, 'MMMM d, yyyy');
  }

  // Date-time with Z or offset: parse as instant, format in target timezone
  const fixedLeap = isoString.replace(/:60(\.\d+)?(?=Z|[+-]|$)/, ':59$1');
  const dt = parseISO(fixedLeap);
  if (!isValid(dt)) return null;

  const formatted = formatInTimeZone(dt, timeZone, fmt);
  const tzAbbr = formatInTimeZone(dt, timeZone, 'zzz');
  const withPeriods = formatted
    .replace(/\bAM\b/g, 'a.m.')
    .replace(/\bPM\b/g, 'p.m.');
  return `${withPeriods} ${tzAbbr}`;
}

/**
 * Current year formatted 'yyyy'.
 * @param {*} dateTime - Date/time value parsable by Date.
 * @returns {string} 'yyyy'
 * @example 2024
 */
export const formatDateYear = dateTime => {
  return format(new Date(dateTime), 'yyyy');
};

/**
 * Passed in dateTime formatted 'MMMM d, yyyy'.
 * @param {*} dateTime - Date/time value parsable by Date.
 * @returns {string} 'MMMM d, yyyy'
 * @example November 27, 2023
 */
export const formatDateMonthDayCommaYear = dateTime => {
  return format(new Date(dateTime), 'MMMM d, yyyy');
};

/**
 * Returns the current date formatted "MMMM d, yyyy, h:mm".
 * @param {*} dateTime - Date/time value parsable by Date.
 * @returns {string} 'MMMM d, yyyy, h:mm'
 * @example August 18, 2022, 4:29
 */
export const formatDateMonthDayCommaYearHoursMinutes = dateTime => {
  return formatInTimeZone(
    subHours(new Date(dateTime), 4),
    'UTC',
    'MMMM d, yyyy, h:mm',
  );
};

/**
 * Date formatted "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'".
 * @param {Date} newDate - Date object to format.
 * @returns {string} UTC timestamp string.
 * @example 2025-11-20T19:14:57.282Z
 */
const formatUtcTime = newDate => {
  return formatInTimeZone(newDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 * Current date minus minutes formatted "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'".
 * @param {number} minutes - Minutes to subtract from now.
 * @returns {string} UTC timestamp string.
 * @example 2025-11-20T19:14:57.282Z
 */
export const currentDateMinusMinutes = minutes => {
  const newDate = subMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 * Current date plus hours formatted "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'".
 * @param {number} hours - Hours to add to now.
 * @returns {string} UTC timestamp string.
 * @example 2025-11-20T19:14:57.282Z
 */
export const currentDateAddHours = hours => {
  const newDate = addHours(new Date(), hours);
  return formatUtcTime(newDate);
};

/**
 * Formats a date for file download matching expected filename format
 * @param {number} seconds
 * @returns {String} Date/time string.
 * @example 11-21-2025_010829PM
 */
export const formatDateForDownload = seconds => {
  const now = new Date();
  const date = addSeconds(now, seconds);
  return format(date, "M-d-yyyy'_'hhmmssa");
};

/**
 * Current date formatted "MM-dd-yyyy'_'hhmmssa".
 * @param {Date} newDate - Date object to format.
 * @returns {string} Date/time string.
 * @example 11-21-2025_010829PM
 */
const formatDateTimeForFileDownload = newDate => {
  return formatInTimeZone(newDate, 'UTC', "MM-dd-yyyy'_'hhmmssa");
};

/**
 * Current date minus seconds formatted "MM-dd-yyyy'_'hhmmssa".
 * @param {number} seconds - Seconds to add to now.
 * @returns {string} Date/time string.
 * @example 11-21-2025_010829PM
 */
export const currentDateAddSecondsForFileDownload = seconds => {
  const newDate = addSeconds(new Date(), seconds);
  return formatDateTimeForFileDownload(newDate);
};
