import moment from 'moment';

import { FORMAT_YMD } from '../constants';
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
