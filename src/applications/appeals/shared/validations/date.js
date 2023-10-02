import moment from 'moment';
import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { FORMAT_YMD } from '../constants';
import { fixDateFormat } from '../utils/replace';

const buildDatePartErrors = (month, day, year) => {
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
    dateString?.length < FORMAT_YMD.length
  );
};

export const createDateObject = rawDateString => {
  const dateString = fixDateFormat(rawDateString);
  const { day, month, year } = parseISODate(dateString);
  const momentDate = moment(rawDateString, FORMAT_YMD);
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const invalidDate =
    dateString?.length < FORMAT_YMD.length || !momentDate.isValid();
  const datePartErrors = buildDatePartErrors(month, day, year);

  return {
    errors: datePartErrors,
    isInvalid: isInvalidDateString(year, day, month, dateString),
    hasErrors:
      datePartErrors.month ||
      datePartErrors.day ||
      datePartErrors.year ||
      invalidDate,
    momentDate,
    isTodayOrInFuture: momentDate.isSameOrAfter(moment().startOf('day')),
  };
};

export const addDateErrorMessages = (errors, errorMessages, date) => {
  if (date.isInvalid) {
    errors.addError(errorMessages.blankDecisionDate);
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
    errors.addError(errorMessages.pastDate);
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
