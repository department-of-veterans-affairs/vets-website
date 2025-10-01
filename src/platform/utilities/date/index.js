import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  isValid,
  format,
  parse,
  parseISO,
} from 'date-fns';
import { coerceToDate } from '../../mhv/downtime/utils/date';

const { utcToZonedTime } = require('date-fns-tz');

export function dateFieldToDate(dateField) {
  const year = dateField.year.value;
  const month =
    dateField.month?.value && dateField.month?.value !== 'XX' // Accept missing month values.
      ? parseInt(dateField.month.value, 10) - 1
      : 0; // Default to January if month is not provided
  const day =
    dateField.day?.value && dateField.day?.value !== 'XX' // Accept missing day values.
      ? dateField.day.value
      : 1; // Default to the first day of the month if day is not provided

  // Construct a date string in the format 'yyyy-MM-dd'
  const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(
    day,
  ).padStart(2, '0')}`;

  // Parse the date string into a Date object
  return parse(dateString, 'yyyy-MM-dd', new Date());
}

/**
 * Handle dates in the following formats:
 *  * Date objects
 *  * ISO 8601 date strings
 *  * Unix timestamps (with ms)
 * @param {Date|string} date - The date to parse
 * @returns {Date} The parsed date
 */
export function parseStringOrDate(date) {
  if (date instanceof Date) {
    return date;
  }

  if (typeof date === 'string' || typeof date === 'number') {
    let dateObject;
    // Check if string is a Unix timestamp
    if (/^\d{13}$/.test(date)) {
      dateObject = new Date(parseInt(date, 10));
    } else {
      dateObject = parseISO(date);
    }
    if (isValid(dateObject) === true) {
      return dateObject;
    }
  }

  const sanitizedDate = inputDate => {
    if (inputDate == null) return String(inputDate); // handles null & undefined
    return String(inputDate)
      .replace(/[A-Za-z]/g, 'A')
      .replace(/\d/g, '1');
  };

  throw new Error(
    `Could not parse date string (sanitized): ${sanitizedDate(
      date,
    )}. Please ensure that you provide a Date object, Unix timestamp with milliseconds, or ISO 8601 date string.`,
  );
}

/**
 * Formats a date object, ISO 8601 date string, or Unix timestamp as January 1, 2020
 * Note: This is a FORMATTING function that returns a string, not a Date object
 *
 * @param {Date|string|number} date
 * @returns {string} Formatted date string
 */
export function formatDateLong(date) {
  const parsedDate = parseStringOrDate(date);
  return format(parsedDate, 'MMMM d, yyyy');
}

export function stripTimezoneFromIsoDate(date) {
  return date ? date.replace(/(Z|[-+](\d{4}|\d{2}:\d{2}))$/, '') : date;
}

export function formatDateParsedZoneLong(date) {
  const localDate = stripTimezoneFromIsoDate(date);
  return format(parseISO(localDate), 'MMMM d, yyyy');
}

/**
 * Formats a date object, ISO 8601 date string, or Unix timestamp as 01/01/2020
 * Note: This is a FORMATTING function that returns a string, not a Date object
 *
 * @param {Date|string|number} date
 * @returns {string} Formatted date string
 */
export function formatDateShort(date) {
  const parsedDate = parseStringOrDate(date);
  return format(parsedDate, 'MM/dd/yyyy');
}

export function formatDateParsedZoneShort(date) {
  const localDate = stripTimezoneFromIsoDate(date);
  return format(parseISO(localDate), 'MM/dd/yyyy');
}

function formatDiff(diff, desc) {
  return `${diff} ${desc}${diff === 1 ? '' : 's'}`;
}

/**
 * timeFromNow returns the number of days, hours, or minutes until
 * the provided date occurs. It’s meant to be less fuzzy than moment’s
 * timeFromNow so it can be used for expiration dates
 *
 * @param date {Date} The future date to check against
 * @param userFromDate {Date} The earlier date in the range. Defaults to today.
 * @returns {string} The string description of how long until date occurs
 */
export function timeFromNow(date, userFromDate = null) {
  // Not using defaulting because we want today to be when this function
  // is called, not when the file is parsed and run
  const fromDate = userFromDate || new Date();
  const dayDiff = differenceInDays(date, fromDate);

  if (dayDiff >= 1) {
    return formatDiff(dayDiff, 'day');
  }

  const hourDiff = differenceInHours(date, fromDate);

  if (hourDiff >= 1) {
    return formatDiff(hourDiff, 'hour');
  }

  const minuteDiff = differenceInMinutes(date, fromDate);

  if (minuteDiff >= 1) {
    return formatDiff(minuteDiff, 'minute');
  }

  const secondDiff = differenceInSeconds(date, fromDate);

  if (secondDiff >= 1) {
    return formatDiff(secondDiff, 'second');
  }

  return 'a moment';
}

/**
 * Checks if the passed-in arg is a valid date string, meaning it can be parsed
 * by Date.parse()
 * Note: This function properly uses Date.parse() and returns a boolean
 *
 * @param {string} dateString The string to validate
 * @returns {boolean} If the string is a valid date string
 */
export function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== 'string') {
    return false;
  }
  
  const timestamp = Date.parse(dateString);
  return !Number.isNaN(timestamp);
}

const monthIndices = {
  JAN: 0,
  FEB: 1,
  MAR: 2,
  APR: 3,
  MAY: 4,
  JUN: 5,
  JUL: 6,
  AUG: 7,
  SEP: 8,
  OCT: 9,
  NOV: 10,
  DEC: 11,
};

const LONG_FORM_MONTHS = [
  monthIndices.MAR,
  monthIndices.APR,
  monthIndices.MAY,
  monthIndices.JUN,
  monthIndices.JUL,
];

/**
 * Formats the given date-time into a string that is intended for use in
 * downtime notifications
 *
 * @param {string || object} dateTime The date-time as one of the following:
 *   * a Date object
 *   * a moment object
 *   * an ISO string in Eastern time
 * @param {string} dayPattern The pattern for the day of the week. Defaults to 'd'.
 *   If the year needs to be included, use 'd, y'.
 * @returns {string} The formatted date-time string
 */
export const formatDowntime = (dateTime, dayPattern = 'd') => {
  let date;
  const timeZone = 'America/New_York';

  if (dateTime instanceof Object) {
    // We need to convert the moment object to a Date object
    // until moment is completely deprecated.
    // TODO: Remove this once moment is completely deprecated.
    date = coerceToDate(dateTime);
  } else {
    date = parseISO(dateTime);
  }

  // Get the hour in Eastern time using date-fns-tz
  const easternTimeZoneDate = utcToZonedTime(date, timeZone);
  const dtMonth = format(easternTimeZoneDate, 'M', { timeZone });
  const dtHour = format(easternTimeZoneDate, 'H', { timeZone });
  const dtMinute = format(easternTimeZoneDate, 'm', { timeZone });
  const dayFormat = format(easternTimeZoneDate, dayPattern, { timeZone });

  const monthFormat = LONG_FORM_MONTHS.includes(dtMonth - 1) ? 'MMMM' : 'MMM.';
  let timeFormat;

  if (dtHour === '0' && dtMinute === '0') {
    timeFormat = "'midnight'";
  } else if (dtHour === '12' && dtMinute === '0') {
    timeFormat = "'noon'";
  } else {
    const amPmFormat = parseInt(dtHour, 10) < 12 ? 'a.m.' : 'p.m.';
    timeFormat = `h:mm '${amPmFormat}'`;
  }

  return format(
    easternTimeZoneDate,
    `${monthFormat} ${dayFormat} 'at' ${timeFormat} 'ET'`,
    { timeZone },
  );
};
