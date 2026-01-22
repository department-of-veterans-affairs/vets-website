import { isValid } from 'date-fns';

import { parseISODate } from '~/platform/forms-system/src/js/helpers';

import { FORMAT_YMD_DATE_FNS } from '../constants';
import {
  fixDateFormat,
  parseDateToDateObj,
  isLocalToday,
  isUTCTodayOrFuture,
  formatDateToReadableString,
} from '../utils/dates';

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

export const isInvalidDateString = (year, day, month, dateString) => {
  return (
    !year ||
    Number.isNaN(Number(year)) ||
    // minimum year is 1900; no need to check if year === '0'
    !day ||
    Number.isNaN(Number(day)) ||
    day === '0' ||
    !month ||
    Number.isNaN(Number(month)) ||
    month === '0' ||
    (!dateString || dateString?.length < FORMAT_YMD_DATE_FNS.length)
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

/**
 * Create dynamic error message for decision dates that are blocked
 * Always show "The date must be before [UTC today expressed as calendar date]"
 * This tells users the earliest acceptable date that will pass validation globally
 * @param {Object} errorMessages - Error messages object containing decisions.pastDate function
 * @returns {string} Formatted error message showing UTC today as calendar date
 */
export const createDecisionDateErrorMsg = errorMessages => {
  const now = new Date();

  const utcTodayAsLocalDate = new Date(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0,
  );

  const cutoffDate = formatDateToReadableString(utcTodayAsLocalDate);

  return errorMessages.decisions.pastDate(cutoffDate);
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
    const decisionDateErrorMessage = createDecisionDateErrorMsg(errorMessages);

    errors.addError(decisionDateErrorMessage);
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
