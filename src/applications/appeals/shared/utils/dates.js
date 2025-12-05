import { parse, parseISO, add, format, isValid, isToday } from 'date-fns';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

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
 * Get current UTC date at start of day (midnight)
 * @returns {Date} - Current UTC date at start of day
 */
export const getCurrentUTCStartOfDay = () => {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
};

/**
 * Convert any date to UTC start of day (preserving calendar date)
 * @param {Date} date - The date to convert
 * @returns {Date} - UTC date at start of day
 */
export const toUTCStartOfDay = date => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
  );
};

/**
 * Check if a date is today in local timezone
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is today locally
 */
export const isLocalToday = date => {
  return isToday(date);
};

/**
 * Check if a date is today or in the future in UTC timezone
 * @param {Date} date - Date to check
 * @returns {boolean} - True if date is today or future in UTC
 */
export const isUTCTodayOrFuture = date => {
  const utcToday = getCurrentUTCStartOfDay();
  const issueDateUtc = toUTCStartOfDay(date);
  return issueDateUtc.getTime() >= utcToday.getTime();
};

/**
 * Format a date object to a user-friendly string
 * @param {Date} date - Date object to format
 * @returns {string} - Date in readable format (e.g., "December 4, 2025")
 */
export const formatDateToReadableString = date => {
  if (!date || !isValid(date)) {
    return '';
  }
  return format(date, FORMAT_READABLE_DATE_FNS);
};
