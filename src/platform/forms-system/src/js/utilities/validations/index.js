import moment from 'moment';

import { isValid, isBefore, isSameDay } from 'date-fns';

import {
  minYear,
  maxYear,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';
import { dateFieldToDate } from '../../../../../utilities/date';

// Re-export shared validation functions for backward compatibility
export { isValidSSN, isValidVAFileNumber } from '../shared-validations';

export function isValidYear(value) {
  return Number(value) >= minYear && Number(value) <= maxYear;
}

export function isValidPartialDate(day, month, year) {
  if (year && !isValidYear(year)) {
    return false;
  }

  return true;
}

export function isValidDate(day, month, year) {
  const momentDate = moment({ day, month: parseInt(month, 10) - 1, year });
  return momentDate.isValid();
}

export function isValidCurrentOrPastDate(day, month, year) {
  const momentDate = moment({ day, month: parseInt(month, 10) - 1, year });
  return momentDate.isSameOrBefore(moment().endOf('day'), 'day');
}

export function isValidCurrentOrFutureDate(day, month, year) {
  const momentDate = moment({ day, month: parseInt(month, 10) - 1, year });
  return momentDate.isSameOrAfter(moment().endOf('day'), 'day');
}

export function isValidCurrentOrPastYear(value) {
  return Number(value) >= minYear && Number(value) < moment().year() + 1;
}

export function isValidCurrentOrPastMonthYear(month, year) {
  const momentDate = moment({ month: parseInt(month, 10) - 1, year });
  return momentDate.isSameOrBefore(moment().endOf('month'), 'month');
}

export function isValidCurrentOrFutureMonthYear(month, year) {
  const momentDate = moment({ month: parseInt(month, 10) - 1, year });
  return momentDate.isSameOrAfter(moment(), 'month');
}

function isBlank(value) {
  return value === '';
}

function isBlankDateField(field) {
  return (
    isBlank(field.day.value) &&
    isBlank(field.month.value) &&
    isBlank(field.year.value)
  );
}

// To do: Fix
// allowSameMonth only checks whether the end/to date is the same as or after the
// start/from date, regardless of month, rename to allowSameDate or fix
export function isValidDateRange(fromDate, toDate, allowSameMonth = false) {
  if (isBlankDateField(toDate) || isBlankDateField(fromDate)) {
    return true;
  }

  const start = dateFieldToDate(fromDate);
  const end = dateFieldToDate(toDate);

  if (!isValid(start) || !isValid(end)) {
    return false;
  }

  return allowSameMonth
    ? isSameDay(end, start) || isBefore(start, end)
    : isBefore(start, end);
}

// Re-export shared validation function for backward compatibility
export { isValidRoutingNumber } from '../shared-validations';

export function isValidPartialMonthYear(month, year) {
  if (typeof month === 'object') {
    throw new Error('Pass a month and a year to function');
  }
  if (month && (Number(month) > 12 || Number(month) < 1)) {
    return false;
  }

  return isValidPartialDate(null, null, year);
}

export function isValidPartialMonthYearInPast(month, year) {
  if (typeof month === 'object') {
    throw new Error('Pass a month and a year to function');
  }
  const momentDate = moment({
    year,
    month: month ? parseInt(month, 10) - 1 : null,
  });
  return (
    !year ||
    (isValidPartialMonthYear(month, year) &&
      momentDate.isValid() &&
      momentDate.isSameOrBefore(moment().startOf('month')))
  );
}

/**
 * Check validations for Custom pages
 * @param {Function[]} validations - array of validation functions
 * @param {*} data - field data passed to the validation function
 * @param {*} fullData - full and appStateData passed to validation function
 * @returns {String[]} - error messages
 */
export const getValidationErrors = (
  validations = [],
  data = {},
  fullData = {},
  index,
) => {
  const errors = { errorMessages: [] };
  errors.addError = message => errors.errorMessages.push(message);
  /* errors, fieldData, formData, schema, uiSchema, index, appStateData */
  validations.map(validation =>
    validation(errors, data, fullData, null, null, index, fullData),
  );
  return errors.errorMessages;
};
