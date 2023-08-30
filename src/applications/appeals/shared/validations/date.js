import moment from 'moment';
import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { FORMAT_YMD } from '../constants';
import { fixDateFormat } from '../utils/replace';

export const buildDatePartErrors = (month, day, year, maxDays) => {
  return {
    month: !month || month < 1 || month > 12,
    day: !day || day < 1 || day > maxDays,
    year: !year,
    other: false, // catch all for partial & invalid dates
  };
};

export const createScreenReaderErrorMsg = datePartErrors => {
  return Object.entries(datePartErrors).reduce(
    (result, [partName, hasError]) => result + (hasError ? `${partName} ` : ''),
    '',
  );
};

export const validateDateString = (year, day, month, dateString) => {
  return (
    !year ||
    !day ||
    isNaN(day) ||
    day === '0' ||
    !month ||
    isNaN(month) ||
    month === '0' ||
    isNaN(year) ||
    dateString?.length < FORMAT_YMD.length
  );
};

export const hasdatePartErrors = (datePartErrors, invalidDate) =>
  datePartErrors.month ||
  datePartErrors.day ||
  datePartErrors.year ||
  invalidDate;

export const dateFunctions = rawString => {
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDays = year && month ? new Date(year, month, 0).getDate() : 31;
  const invalidDate = dateString?.length < FORMAT_YMD.length || !date.isValid();
  const datePartErrors = buildDatePartErrors(month, day, year, maxDays);
  const todayOrFutureDate = date.isSameOrAfter(moment().startOf('day'));

  return {
    invalidDate,
    datePartErrors,
    isInvalidDateString: validateDateString(year, day, month, invalidDate),
    hasErrorDate: hasdatePartErrors(datePartErrors, invalidDate),
    date,
    todayOrFutureDate,
  };
};

export const dateErrorMsgs = (
  errors,
  errorMessages,
  datePartErrors,
  isInvalidDateString,
  hasErrorDate,
  todayOrFutureDate,
) => {
  if (isInvalidDateString) {
    errors.addError(errorMessages.missingDecisionDate);
    // eslint-disable-next-line no-param-reassign
    datePartErrors.other = true; // other part error
    return true;
  }
  if (hasErrorDate) {
    errors.addError(errorMessages.invalidDate);
    // eslint-disable-next-line no-param-reassign
    datePartErrors.other = true; // other part error
    return true;
  }
  if (todayOrFutureDate) {
    // Lighthouse won't accept same day (as submission) decision date
    errors.addError(errorMessages.pastDate);
    // eslint-disable-next-line no-param-reassign
    datePartErrors.year = true; // only the year is invalid at this point
    return true;
  }
  return false;
};
