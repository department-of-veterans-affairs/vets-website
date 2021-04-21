import { add, format } from 'date-fns';

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
 * @param {Date} [startDate=new Date()] - starting date of offset
 * @param {String} [pattern=FORMAT_YMD]
 * @returns {String} - formatted as 'YYYY-MM-DD'
 */
export const getDate = ({
  offset = {},
  startDate = new Date(),
  pattern = FORMAT_YMD,
} = {}) => format(add(startDate, offset), pattern);
