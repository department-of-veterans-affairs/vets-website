import range from 'lodash/range';
import moment from 'moment';

import {
  minYear,
  maxYear,
} from '@department-of-veterans-affairs/platform-forms-system/helpers';

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
export function isValidSSN(value) {
  if (
    value === '123456789' ||
    value === '123-45-6789' ||
    /^0{3}-?\d{2}-?\d{4}$/.test(value) ||
    /^\d{3}-?0{2}-?\d{4}$/.test(value) ||
    /^\d{3}-?\d{2}-?0{4}$/.test(value)
  ) {
    return false;
  }

  const noBadSameDigitNumber = range(0, 10).every(i => {
    const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
    return !sameDigitRegex.test(value);
  });

  if (!noBadSameDigitNumber) {
    return false;
  }

  return /^\d{9}$/.test(value) || /^\d{3}-\d{2}-\d{4}$/.test(value);
}

// A 9 digit VA File Number must be an SSN
// The only other valid option is an 8-digit number
export function isValidVAFileNumber(value) {
  if (/^\d{9}$/.test(value) || /^\d{3}-\d{2}-\d{4}$/.test(value)) {
    return isValidSSN(value);
  }

  return /^\d{8}$/.test(value);
}

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

export function dateToMoment(dateField) {
  return moment({
    year: dateField.year.value,
    month: dateField.month.value ? parseInt(dateField.month.value, 10) - 1 : '',
    day: dateField.day ? dateField.day.value : null,
  });
}

export function isValidDateRange(fromDate, toDate, allowSameMonth = false) {
  if (isBlankDateField(toDate) || isBlankDateField(fromDate)) {
    return true;
  }

  const momentStart = dateToMoment(fromDate);
  const momentEnd = dateToMoment(toDate);

  if (!momentStart.isValid() || !momentEnd.isValid()) {
    return false;
  }

  return allowSameMonth
    ? momentStart.isSameOrBefore(momentEnd)
    : momentStart.isBefore(momentEnd);
}

// Pulled from https://en.wikipedia.org/wiki/Routing_transit_number#Check_digit
export function isValidRoutingNumber(value) {
  if (/^\d{9}$/.test(value)) {
    const digits = value.split('').map(val => parseInt(val, 10));
    const weighted =
      3 * (digits[0] + digits[3] + digits[6]) +
      7 * (digits[1] + digits[4] + digits[7]) +
      (digits[2] + digits[5] + digits[8]);

    return weighted % 10 === 0;
  }
  return false;
}

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
