import moment from 'moment';
import { parseISODate } from 'platform/forms-system/src/js/helpers';

import { FORMAT_YMD } from '../constants';
import { fixDateFormat } from '../utils/replace';

export const buildErrorParts = (month, day, year, maxDays) => {
  return {
    month: !month || month < 1 || month > 12,
    day: !day || day < 1 || day > maxDays,
    year: !year,
    other: false, // catch all for partial & invalid dates
  };
};

export const createPartsError = errorParts => {
  return Object.entries(errorParts).reduce(
    (result, [partName, hasError]) => result + (hasError ? `${partName} ` : ''),
    '',
  );
};

export const isInvalidDateString = (year, day, month, dateString) => {
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

export const hasErrorParts = errorParts =>
  errorParts.month || errorParts.day || errorParts.year;

export const foo = rawString => {
  const dateString = fixDateFormat(rawString);
  const { day, month, year } = parseISODate(dateString);
  const date = moment(rawString, FORMAT_YMD);
  // get last day of the month (month is zero based, so we're +1 month, day 0);
  // new Date() will recalculate and go back to last day of the previous month
  const maxDays = year && month ? new Date(year, month, 0).getDate() : 31;
  const invalidDate = dateString?.length < FORMAT_YMD.length || !date.isValid();
  const errorParts = buildErrorParts(month, day, year, maxDays);

  return {
    invalidDate,
    errorParts,
    isInvalidDateString: isInvalidDateString(year, day, month, invalidDate),
    hasErrorDate: hasErrorParts(errorParts) || invalidDate,
    date,
  };
};
