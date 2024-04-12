import { parse, parseISO, format, isValid } from 'date-fns';

import { FORMAT_YMD_DATE_FNS } from '../constants';

/**
 * parseDate from string, date, or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @param {string} resultFormat - date-fns format string
 * @param {string} currentFormat - date-fns format string if `date` is not ISO8601
 * @returns {string} date
 */
export const parseDate = (
  date,
  resultFormat = FORMAT_YMD_DATE_FNS,
  currentFormat = null,
) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (currentFormat) {
      //
      newDate = parse(date, currentFormat, new Date());
    }
  }
  return isValid(newDate) ? format(newDate, resultFormat) : null;
};
