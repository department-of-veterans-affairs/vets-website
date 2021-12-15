import moment from 'moment';

import { FORMAT_YMD } from '../constants';
/**
 * @typedef DateFns~offset
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
 * @param {DateFns~offset} [offset={}] - date offset
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

/**
 * @typedef SimpleDate~entry
 * @property {Boolean} dirty - Indicates of the field has been touched
 * @property {String} value - Value of the field
 */
/**
 * @typedef SinpleDate~date - SimpleDate object
 * @property {SimpleDate~entry} month
 * @property {SimpleDate~entry} day
 * @property {SimpleDate~entry} year
 */
/**
 * Convert SimpleDate object to 'YYYY-MM-DD' string
 * @param {SimpleDate~date} date - date object
 * @returns {String} - formatted as 'YYYY-MM-DD'
 */
export const getIsoDateFromSimpleDate = date =>
  [
    date.year.value ? date.year.value : '',
    date.month.value ? `00${date.month.value}`.slice(-2) : '',
    date.day.value ? `00${date.day.value}`.slice(-2) : '',
  ]
    .filter(Boolean)
    .join('-');

/**
 * Convert date string to SimpleDate object
 * @param {String} date - 'YYYY-MM-DD'
 * @returns {SimpleDate~date}
 */
export const getSimpleDateFromIso = date => {
  const [year, month, day] = (date || '').split('-');
  const fullDate = year && month && day;
  return {
    year: { value: fullDate ? year : '', dirty: false },
    month: { value: fullDate ? parseInt(month, 10) : '', dirty: false },
    day: { value: fullDate ? parseInt(day, 10) : '', dirty: false },
  };
};
