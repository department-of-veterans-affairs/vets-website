import {
  addHours,
  addMinutes,
  subHours,
  subMinutes,
  addSeconds,
} from 'date-fns';
import { formatInTimeZone, format } from 'date-fns-tz';

/**
 *
 *  @param dateTime
 * @returns {String}
 */
export const formatDateYear = dateTime => {
  return format(new Date(dateTime), 'yyyy');
};

/**
 *
 *  @param dateTime
 * @returns {String}
 */
export const formatDateMonthDayCommaYear = dateTime => {
  return format(new Date(dateTime), 'MMMM d, yyyy');
};

/**
 *
 *  @param dateTime
 * @returns {String}
 */
export const formatDateMonthDayCommaYearHoursMinutes = dateTime => {
  return format(new Date(dateTime), 'MMMM d, yyyy HH:mm');
};

/**
 * Returns the current date formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @param newDate
 * @returns {String}
 */
const formatUtcTime = newDate => {
  return formatInTimeZone(newDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 * Returns the current date plus minutes formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @param {number} minutes
 * @returns {String}
 */
export const currentDateAddMinutes = minutes => {
  const newDate = addMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 * Returns the current date minus minutes formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @param {number} minutes
 * @returns {String}
 */
export const currentDateMinusMinutes = minutes => {
  const newDate = subMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 * Returns the current date plus hours formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @param {number} hours
 * @returns {String}
 */
export const currentDateAddHours = hours => {
  const newDate = addHours(new Date(), hours);
  return formatUtcTime(newDate);
};

/**
 * Returns the current date minus 1 minute and plus 1 hour formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @returns {String}
 */
export const currentDateAddOneHourMinusOneMinute = () => {
  const newDate = subMinutes(addHours(new Date(), 1), 1);
  return formatUtcTime(newDate);
};

/**
 * Returns the current date minus hours formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'" Example: 2025-11-20T19:14:57.282Z
 *
 * @param {number} hours
 * @returns {String}
 */
export const currentDateMinusHours = hours => {
  const newDate = subHours(new Date(), hours);
  return formatUtcTime(newDate);
};

/**
 * Returns the current date formated "MM-dd-yyyy'_'hhmmssa" Example: 11-21-2025_010829p.m.
 *
 * @param newDate
 * @returns {String}
 */
const formatDateTimeForFileDownload = newDate => {
  return formatInTimeZone(newDate, 'UTC', "MM-dd-yyyy'_'hhmmssa");
};

/**
 * Returns the current date minus seconds formated "MM-dd-yyyy'_'hhmmssa" Example: 11-21-2025_010829p.m.
 *
 * @param {number} seconds
 * @returns {String}
 */
export const currentDateAddSecondsForFileDownload = seconds => {
  const newDate = addSeconds(new Date(), seconds);
  return formatDateTimeForFileDownload(newDate);
};
