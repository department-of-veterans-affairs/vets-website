import { isValid, parse, parseISO } from 'date-fns';
import { get } from 'lodash';

/**
 * Checks if required data is present based on config
 * @param {Object} data - The data to check
 * @param {Object} config - The field configuration
 * @returns {boolean} Whether all required data is present
 */
export const getMissingData = (data, config) => {
  const checks = {
    showName: get(data, 'userFullName.first') || get(data, 'userFullName.last'),
    showSSN: !config.showSSN || get(data, 'ssnLastFour'),
    showVAFileNumber: !config.showVAFileNumber || get(data, 'vaFileLastFour'),
    showDateOfBirth: !config.showDateOfBirth || get(data, 'dob'),
    showGender: !config.showGender || get(data, 'gender'),
  };

  return Object.keys(checks).filter(key => !checks[key]);
};

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};
export const FORMAT_YMD_DATE_FNS_CONCAT = 'yyyyMMdd';
export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_COMPACT_DATE_FNS = 'MMM d, yyyy';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';
