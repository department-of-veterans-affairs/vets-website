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
 *
 * @returns {String}
 */
export const currentLocalTime = () => {
  return format(new Date(), "EEE MMM. dd yyyy HH:mm:ss 'GMT'xx");
};

/**
 *
 * @param newDate
 * @returns {String}
 */
const formatTimeForCCD = newDate => {
  return formatInTimeZone(newDate, 'UTC', "MM-dd-yyyy'_'hhmmssa");
};

/**
 *
 * @param newDate
 * @returns {String}
 */
const formatUtcTime = newDate => {
  return formatInTimeZone(newDate, 'UTC', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};

/**
 *
 * @param seconds
 * @returns {String}
 */
export const currentDateAddSecondsCCD = seconds => {
  const newDate = addSeconds(new Date(), seconds);
  return formatTimeForCCD(newDate);
};

/**
 *
 * @param minutes
 * @returns {String}
 */
export const currentDateFnsAddMinutes = minutes => {
  const newDate = addMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 *
 * @param minutes
 * @returns {String}
 */
export const currentDateFnsMinusMinutes = minutes => {
  const newDate = subMinutes(new Date(), minutes);
  return formatUtcTime(newDate);
};

/**
 *
 * @param hours
 * @returns {String}
 */
export const currentDateFnsAddHours = hours => {
  const newDate = addHours(new Date(), hours);
  return formatUtcTime(newDate);
};

/**
 *
 * @returns {String}
 */
export const currentDateFnsAddOneHourMinusOneMinute = () => {
  const newDate = subMinutes(addHours(new Date(), 1), 1);
  return formatUtcTime(newDate);
};

/**
 *
 * @param hours
 * @returns {String}
 */
export const currentDateFnsMinusHours = hours => {
  const newDate = subHours(new Date(), hours);
  return formatUtcTime(newDate);
};
