import { addHours, subHours, subMinutes, addSeconds } from 'date-fns';
import { formatInTimeZone, format } from 'date-fns-tz';

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
 * Current date formatted "MM-dd-yyyy'_'hhmmssa".
 * @param {Date} newDate - Date object to format.
 * @returns {string} Date/time string.
 * @example 11-21-2025_010829p.m.
 */
const formatDateTimeForFileDownload = newDate => {
  return formatInTimeZone(newDate, 'UTC', "MM-dd-yyyy'_'hhmmssa");
};

/**
 * Current date minus seconds formatted "MM-dd-yyyy'_'hhmmssa".
 * @param {number} seconds - Seconds to add to now.
 * @returns {string} Date/time string.
 * @example 11-21-2025_010829p.m.
 */
export const currentDateAddSecondsForFileDownload = seconds => {
  const newDate = addSeconds(new Date(), seconds);
  return formatDateTimeForFileDownload(newDate);
};
