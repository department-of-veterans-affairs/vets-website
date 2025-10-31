import { isValid } from 'date-fns';

import { parseISODate } from '~/platform/forms-system/src/js/helpers';

import { FORMAT_YMD_DATE_FNS } from '../constants';
import {
  parseDateToDateObj,
  isLocalToday,
  isUTCTodayOrFuture,
} from '../utils/dates';
import { fixDateFormat } from '../utils/replace';

/**
 * Main validation method: Check if a date should be blocked from appeal submission
 * Uses dual validation approach combining local timezone and UTC validation
 * This prevents same-day submissions globally while maintaining backend consistency
 *
 * Decision tree:
 * 1. If decision date is same as current local calendar day → Block (return true)
 * 2. If different local calendar day but same UTC day → Block (return true)
 * 3. If both different → Allow (return false)
 *
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date should be blocked from appeal submission
 */
export const isTodayOrInFuture = date => {
  if (!date || !isValid(date)) return false;
  return isLocalToday(date) || isUTCTodayOrFuture(date);
};

const buildDatePartErrors = (month, day, year) => {
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDaysInAMonth =
    year && month ? new Date(year, month, 0).getDate() : 31;
  return {
    month: !month || month < 1 || month > 12,
    day: !day || day < 1 || day > maxDaysInAMonth,
    year: !year,
    other: false, // catch all for partial & invalid dates
  };
};

const isInvalidDateString = (year, day, month, dateString) => {
  return (
    !year ||
    isNaN(year) ||
    // minimum year is 1900; no need to check if year === '0'
    !day ||
    isNaN(day) ||
    day === '0' ||
    !month ||
    isNaN(month) ||
    month === '0' ||
    dateString?.length < FORMAT_YMD_DATE_FNS.length
  );
};

export const createDateObject = rawDateString => {
  const dateString = fixDateFormat(rawDateString);
  const { day, month, year } = parseISODate(dateString);
  const dateObj = parseDateToDateObj(rawDateString, FORMAT_YMD_DATE_FNS);
  const invalidDate =
    dateString?.length < FORMAT_YMD_DATE_FNS.length || !isValid(dateObj);
  const datePartErrors = buildDatePartErrors(month, day, year);

  return {
    errors: datePartErrors,
    isInvalid: isInvalidDateString(year, day, month, dateString),
    hasErrors:
      datePartErrors.month ||
      datePartErrors.day ||
      datePartErrors.year ||
      invalidDate,
    dateObj,
    isTodayOrInFuture: isTodayOrInFuture(dateObj),
  };
};

export const addDateErrorMessages = (errors, errorMessages, date) => {
  if (date.isInvalid) {
    errors.addError(errorMessages.decisions.blankDate);
    // eslint-disable-next-line no-param-reassign
    date.errors.other = true; // other part error
    return true;
  }
  if (date.hasErrors) {
    errors.addError(errorMessages.invalidDate);
    // eslint-disable-next-line no-param-reassign
    date.errors.other = true; // other part error
    return true;
  }
  if (date.isTodayOrInFuture) {
    // Lighthouse won't accept same day (as submission) decision date
    // Using UTC-based validation to match backend behavior
    errors.addError(errorMessages.decisions.pastDate);
    // eslint-disable-next-line no-param-reassign
    date.errors.year = true; // only the year is invalid at this point
    return true;
  }
  return false;
};

// add second error message containing the part of the date with an error;
// used to add `aria-invalid` to the specific input
export const createScreenReaderErrorMsg = (errors, datePartErrors) => {
  const partialDateError = Object.entries(datePartErrors).reduce(
    (result, [partName, hasError]) => result + (hasError ? `${partName} ` : ''),
    '',
  );
  if (partialDateError) {
    errors.addError(partialDateError);
  }
};
