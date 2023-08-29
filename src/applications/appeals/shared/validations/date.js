import { FORMAT_YMD } from '../constants';

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

export const hasErrorParts = (errorParts, invalidDate) =>
  errorParts.month || errorParts.day || errorParts.year || invalidDate;
