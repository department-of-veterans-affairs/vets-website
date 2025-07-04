/**
 * TODO: tech-debt(you-dont-need-momentjs): Waiting for Node upgrade to support Temporal API
 * @see https://github.com/department-of-veterans-affairs/va.gov-team/issues/110024
 */
/* eslint-disable you-dont-need-momentjs/no-import-moment */
/* eslint-disable you-dont-need-momentjs/no-moment-constructor */
import moment from 'moment';

/**
 * Internal utility to safely create moment objects
 * @private
 */
const safeMoment = date => {
  if (!date) return null;
  const momentDate = moment(date);
  return momentDate.isValid() ? momentDate : null;
};

/**
 * Check if date1 is before date2
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity (day, month, year, etc.)
 * @returns {boolean} True if date1 is before date2
 */
export const isDateBefore = (date1, date2, granularity = 'day') => {
  const firstDate = safeMoment(date1);
  const secondDate = safeMoment(date2);

  if (!firstDate || !secondDate) return false;

  return firstDate.isBefore(secondDate, granularity);
};

/**
 * Check if date1 is after date2
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} True if date1 is after date2
 */
export const isDateAfter = (date1, date2, granularity = 'day') => {
  const firstDate = safeMoment(date1);
  const secondDate = safeMoment(date2);

  if (!firstDate || !secondDate) return false;

  return firstDate.isAfter(secondDate, granularity);
};

/**
 * Check if two dates are the same
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} True if dates are the same
 */
export const isDateSame = (date1, date2, granularity = 'day') => {
  const firstDate = safeMoment(date1);
  const secondDate = safeMoment(date2);

  if (!firstDate || !secondDate) return false;

  return firstDate.isSame(secondDate, granularity);
};

/**
 * Check if a date is between two other dates
 * @param {string} date - Date to check
 * @param {string} startDate - Start of range
 * @param {string} endDate - End of range
 * @param {string} granularity - Comparison granularity
 * @param {string} inclusivity - '()', '[]', '(]', '[)' (default: '[]')
 * @returns {boolean} True if date is between start and end
 */
export const isDateBetween = (
  date,
  startDate,
  endDate,
  granularity = 'day',
  inclusivity = '[]',
) => {
  const dateToCheck = safeMoment(date);
  const rangeStartDate = safeMoment(startDate);
  const rangeEndDate = safeMoment(endDate);

  if (!dateToCheck || !rangeStartDate || !rangeEndDate) return false;

  return dateToCheck.isBetween(
    rangeStartDate,
    rangeEndDate,
    granularity,
    inclusivity,
  );
};

/**
 * General purpose date comparison
 * @param {string} date1 - First date
 * @param {string} date2 - Second date
 * @param {string} operator - Comparison operator: '<', '>', '<=', '>=', '==', '!='
 * @param {string} granularity - Comparison granularity
 * @returns {boolean} Result of comparison
 */
export const compareDates = (date1, date2, operator, granularity = 'day') => {
  const firstDate = safeMoment(date1);
  const secondDate = safeMoment(date2);

  if (!firstDate || !secondDate) return false;

  switch (operator) {
    case '<':
      return firstDate.isBefore(secondDate, granularity);
    case '>':
      return firstDate.isAfter(secondDate, granularity);
    case '<=':
      return firstDate.isSameOrBefore(secondDate, granularity);
    case '>=':
      return firstDate.isSameOrAfter(secondDate, granularity);
    case '==':
      return firstDate.isSame(secondDate, granularity);
    case '!=':
      return !firstDate.isSame(secondDate, granularity);
    default:
      throw new Error(`Invalid operator: ${operator}`);
  }
};
