import { parseISO, format, isValid } from 'date-fns';

import { FORMAT_YMD, FORMAT_FULL_DATE } from '../constants';

/**
 * parseDate from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @param {string} template - date-fns format string
 * @returns {string} date
 */
export const parseDate = (date, template = FORMAT_FULL_DATE) => {
  let newDate = date;
  if (typeof date === 'string') {
    newDate = parseISO((date || '').split('T')[0]);
  }
  return isValid(newDate) ? format(newDate, template) : null;
};

/**
 * @typedef DateFnsOffset
 * @property {Number} years - positive or negative number
 * @property {Number} months - positive or negative number
 * @property {Number} weeks - positive or negative number
 * @property {Number} days - positive or negative number
 * @property {Number} hours - positive or negative number
 * @property {Number} minutes - positive or negative number
 * @property {Number} seconds - positive or negative number
 */
/**
 * Get dynamic date value based on starting date and an offset
 * @param {DateFnsOffset} [offset={}] - date offset
 * @param {Date} [date=new Date()] - starting date of offset
 * @param {String} [pattern=FORMAT_YMD]
 * @returns {String} - formatted as 'YYYY-MM-DD'
 */
export const getDate = ({
  offset = {},
  date = new Date(),
  pattern = FORMAT_YMD,
} = {}) => {
  const dateObj = moment(date);
  return dateObj.isValid() ? dateObj.add(offset).format(pattern) : date;
};
