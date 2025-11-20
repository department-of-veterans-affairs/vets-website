import { addHours, addMinutes, subHours, subMinutes } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

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

/**
 *
 * @param minutes
 * @returns {String}
 */
export const currentDateMinusMinutes = minutes => {
  const now = new Date();
  const newDate = new Date(now.getTime() - 60000 * minutes); // 60000 milliseconds = 1 minute
  return newDate.toISOString();
};

/**
 *
 * @param minutes
 * @returns {String}
 */
export const currentDateAddMinutes = minutes => {
  const now = new Date();
  const newDate = new Date(now.getTime() + 60000 * minutes); // 60000 milliseconds = 1 minute
  return newDate.toISOString();
};
