import { parse, parseISO, add, format, isValid } from 'date-fns';

import { FORMAT_YMD_DATE_FNS, FORMAT_READABLE_DATE_FNS } from '../constants';

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (newDate instanceof Date && isValid(newDate)) {
    // Remove timezone offset
    newDate = newDate.toISOString();
  }
  if (typeof newDate === 'string') {
    if (newDate.includes('T')) {
      newDate = parseISO((newDate || '').split('T')[0]);
    } else if (template) {
      newDate = parse(newDate, template, new Date());
    }
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
