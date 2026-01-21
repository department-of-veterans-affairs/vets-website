import { parseISODate } from 'platform/forms-system/src/js/helpers';
import { parse, parseISO, add, format, isToday, isValid } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { addLeadingZero, coerceStringValue } from '.';
import {
  FORMAT_YMD_DATE_FNS,
  FORMAT_READABLE_DATE_FNS,
  REGEXP,
  VA_LONG_FORM_MONTHS,
} from '../constants';

const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * Get the current timezone abbreviation (e.g., "PST", "EST", "JST")
 * Uses date-fns-tz to properly handle DST (EDT vs EST, PDT vs PST, etc.)
 * @returns {string} Timezone abbreviation
 */
export const getCurrentTimeZoneAbbr = () => {
  const timezone = USER_TIMEZONE;
  const now = new Date();

  return formatInTimeZone(now, timezone, 'zzz');
};

/**
 * Helper: Format date part in readable format
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone (defaults to user's current timezone)
 * @returns {string} Formatted date (e.g., "January 15, 2024")
 */
export const formatDatePart = (date, timezone = USER_TIMEZONE) => {
  return formatInTimeZone(date, timezone, 'MMMM d, yyyy');
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
 * Format a date object to VA.gov style with proper month abbreviations
 * VA.gov style guide: Jan., Feb., Aug., Sept., Oct., Nov., Dec.
 * (Don't abbreviate March, April, May, June, July.)
 * @param {Date} date - Date object to format
 * @returns {string} - Date in VA.gov format (e.g., "Dec. 10, 2025" or "March 15, 2025")
 */
export const formatDateToReadableString = date => {
  if (!date || !isValid(date)) {
    return '';
  }

  const month = date.getMonth();

  if (VA_LONG_FORM_MONTHS.includes(month)) {
    return format(date, FORMAT_READABLE_DATE_FNS);
  }

  // Use standard abbreviation with period, handle September special case
  const monthText = format(date, 'MMM');
  const abbreviatedMonth = monthText === 'Sep' ? 'Sept.' : `${monthText}.`;
  const day = format(date, 'd');
  const year = format(date, 'yyyy');

  return `${abbreviatedMonth} ${day}, ${year}`;
};

/**
 * Helper: Format time part in readable format
 * @param {Date} date - Date to format
 * @param {string} timezone - Target timezone (defaults to user's current timezone)
 * @returns {string} Formatted time (e.g., "3:45 p.m.")
 */
export const formatTimePart = (date, timezone = USER_TIMEZONE) => {
  // Use date-fns-tz to format time with proper AM/PM formatting
  const timeString = formatInTimeZone(date, timezone, 'h:mm a');
  // Convert "AM" to "a.m." and "PM" to "p.m." to match VA style guide
  return timeString.replace(/AM/g, 'a.m.').replace(/PM/g, 'p.m.');
};

/**
 * Helper: Format date with midnight in local timezone
 * E.g., in California (UTC-8), if decision was today, UTC midnight tomorrow converts to 5:00 p.m. today
 * Business decision: Don't allow same-day appeals, so we show stable "12:00 a.m. tomorrow" format
 * @param {Date} date - Date to format
 * @param {string} timezoneAbbr - Timezone abbreviation (optional, will be determined automatically)
 * @returns {string} Formatted date with midnight time
 */
export const formatDateWithMidnight = (date, timezoneAbbr) => {
  const userTimezone = USER_TIMEZONE;
  const abbr = timezoneAbbr || getCurrentTimeZoneAbbr();
  return `${formatDatePart(date, userTimezone)}, 12:00 a.m. ${abbr}`;
};

/**
 * Helper: Format date with specific time in local timezone
 * Used for showing UTC conversion times, e.g., in Japan (UTC+9), UTC midnight becomes 9:00 a.m. JST
 * @param {Date} date - Date to format
 * @param {string} timezoneAbbr - Timezone abbreviation (optional, will be determined automatically)
 * @returns {string} Formatted date with specific time
 */
export const formatDateWithTime = (date, timezoneAbbr) => {
  const userTimezone = USER_TIMEZONE;
  const abbr = timezoneAbbr || getCurrentTimeZoneAbbr();
  const datePart = formatDatePart(date, userTimezone);
  const timePart = formatTimePart(date, userTimezone);
  return `${datePart}, ${timePart} ${abbr}`;
};

/**
 * Change a date string with no leading zeros (e.g. 2020-1-2) into a date with
 * leading zeros (e.g. 2020-01-02) as expected in the schema
 * @param {String} dateString YYYY-M-D or YYYY-MM-DD date string
 * @returns {String} YYYY-MM-DD date string
 */
export const fixDateFormat = (date, yearOnly = false) => {
  const dateString = coerceStringValue(date).replace(REGEXP.WHITESPACE, '');

  if (dateString.length === 10 || dateString === '') {
    return dateString;
  }

  // Stopgap solution to properly format a year only when provided for a VA treatment date "before 2005"
  // Coming into this function it will have a format of {year}-01. Here we'll add a day of 01
  // Remove this when the new date components are implemented and the fields are required
  if (yearOnly) {
    return `${dateString}-01`;
  }

  const { day, month, year } = parseISODate(dateString);
  return `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
};
