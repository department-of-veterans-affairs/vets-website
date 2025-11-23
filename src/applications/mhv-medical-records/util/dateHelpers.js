import { addHours, subHours, subMinutes, addSeconds } from 'date-fns';
import { formatInTimeZone, format } from 'date-fns-tz';

/**
 *
 *  @param dateTime
 *
 *  Current year formatted 'yyyy'
 *  @example 2024
 * @returns {String}
 */
export const formatDateYear = dateTime => {
  return format(new Date(dateTime), 'yyyy');
};

/**
 *
 *  @param dateTime
 *  @example
 * @returns {String}
 */
export const formatDateMonthDayCommaYear = dateTime => {
  return format(new Date(dateTime), 'MMMM d, yyyy');
};

/**
 * Returns the Current date formated "MMMM d, yyyy, h:mm" Example: August 18, 2022, 4:29
 *
 *  @param dateTime
 *  @example
 * @returns {String}
 */
export const formatDateMonthDayCommaYearHoursMinutes = dateTime => {
  return formatInTimeZone(
    subHours(new Date(dateTime), 4),
    'UTC',
    'MMMM d, yyyy, h:mm',
  );
};

/**
 *
 * @param newDate
 *
 * Date formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
 * @example 2025-11-20T19:14:57.282Z
 * @returns {String}
 */
const formatUtcTime = newDate => {
  return formatInTimeZone(newDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 *
 * @param {number} minutes
 *
 * Current date minus minutes formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
 * @example 2025-11-20T19:14:57.282Z
 * @returns {String}
 */
export const currentDateMinusMinutes = minutes => {
  const newDate = subMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 *
 *
 * @param {number} hours
 *
 * Current date plus hours formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
 * @example 2025-11-20T19:14:57.282Z
 * @returns {String}
 */
export const currentDateAddHours = hours => {
  const newDate = addHours(new Date(), hours);
  return formatUtcTime(newDate);
};

/**
 *
 * Current date minus 1 minute and plus 1 hour formated "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
 * @example 2025-11-20T19:14:57.282Z
 * @returns {String}
 */
export const currentDateAddOneHourMinusOneMinute = () => {
  const newDate = subMinutes(addHours(new Date(), 1), 1);
  return formatUtcTime(newDate);
};

/**
 *
 *
 * @param newDate
 *
 * Current date formated "MM-dd-yyyy'_'hhmmssa"
 * @example 11-21-2025_010829p.m.
 * @returns {String}
 */
const formatDateTimeForFileDownload = newDate => {
  return formatInTimeZone(newDate, 'UTC', "MM-dd-yyyy'_'hhmmssa");
};

/**
 *
 *
 * @param {number} seconds
 *
 * Current date minus seconds formated "MM-dd-yyyy'_'hhmmssa"
 * @example 11-21-2025_010829p.m.
 * @returns {String}
 */
export const currentDateAddSecondsForFileDownload = seconds => {
  const newDate = addSeconds(new Date(), seconds);
  return formatDateTimeForFileDownload(newDate);
};
