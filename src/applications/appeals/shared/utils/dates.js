import { parse, parseISO, add, format, isValid } from 'date-fns';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

// Common timezone abbreviations for VA.gov users
const TIMEZONE_ABBREVIATIONS = {
  'Asia/Tokyo': 'JST',
  'America/New_York': 'EST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'America/Los_Angeles': 'PST',
  'Europe/London': 'GMT',
  'Europe/Paris': 'CET',
  'Australia/Sydney': 'AEDT',
};

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};

/**
 * parseDate from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @param {string} template - output date-fns format string
 * @param {string} currentFormat - input date-fns format string
 * @returns {string|null} formatted date string
 */
export const parseDate = (
  date,
  template = FORMAT_YMD_DATE_FNS,
  currentFormat,
) => {
  const newDate = parseDateToDateObj(date, currentFormat);
  return newDate ? format(newDate, template) : null;
};

/**
 * Date-fns offsets - see https://date-fns.org/v3.6.0/docs/add#arguments
 * @typedef DateFnsOffset
 * @type {Object}
 * @property {Number} years - positive or negative number
 * @property {Number} months - positive or negative number
 * @property {Number} weeks - positive or negative number
 * @property {Number} days - positive or negative number
 * @property {Number} hours - positive or negative number
 * @property {Number} minutes - positive or negative number
 * @property {Number} seconds - positive or negative number
 * @example { years: 2, months: -3, days: 7 }
 */
/**
 * Parse date string
 * @param {DateFnsOffset} offset
 * @param {Date} date - Date object
 * @param {string} template - output date-fns format string
 * @param {string} currentFormat - input date-fns format string
 * @returns {string|null} formatted date string
 */
export const parseDateWithOffset = (
  offset = {},
  date = new Date(),
  template = FORMAT_YMD_DATE_FNS,
) => parseDate(add(date, offset), template);

/**
 * Convert YYYY-MM-DD to readable date format
 * @param {string} dateString (YYYY-MM-DD)
 * @returns {string} Readable date format
 */
export const getReadableDate = dateString =>
  parseDate(dateString, FORMAT_READABLE_DATE_FNS, FORMAT_YMD_DATE_FNS);

/**
 * Get tomorrow's date formatted for display to users
 * @returns {string} Tomorrow's date in "Month Day, Year" format
 */
export const getTomorrowFormatted = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};

/**
 * Get the current timezone abbreviation (e.g., "PST", "EST")
 * @returns {string} Timezone abbreviation or empty string if not available
 */
export const getCurrentTimeZoneAbbr = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const date = new Date();

  if (TIMEZONE_ABBREVIATIONS[timezone]) {
    return TIMEZONE_ABBREVIATIONS[timezone];
  }

  // Fall back to browser's native abbreviation
  return (
    new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' })
      .formatToParts(date)
      .find(part => part.type === 'timeZoneName')?.value || ''
  );
};
