import { parseISO, format, isValid } from 'date-fns';

import { FORMAT_YMD_DATE_FNS } from '../constants';

/**
 * parseDate from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @param {string} template - date-fns format string
 * @returns {string} date
 */
export const parseDate = (date, template = FORMAT_YMD_DATE_FNS) => {
  let newDate = date;
  if (typeof date === 'string') {
    newDate = parseISO((date || '').split('T')[0]);
  }
  return isValid(newDate) ? format(newDate, template) : null;
};
