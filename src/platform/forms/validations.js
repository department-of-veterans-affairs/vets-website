import { range } from 'lodash';
import {
  minYear,
  currentYear,
  maxYear,
} from 'platform/forms-system/src/js/helpers';
import { dateToMoment } from '../utilities/date';

/**
 * General Validations *
 */
function validateIfDirty(field, validator) {
  if (field.dirty) {
    return validator(field.value);
  }

  return true;
}

function validateCustomFormComponent(customValidation) {
  // Allow devs to pass in an array of validations with messages and display the first failed one
  if (Array.isArray(customValidation)) {
    if (customValidation.some(validator => !validator.valid)) {
      return customValidation.filter(validator => !validator.valid)[0];
    }
    // Also allow objects for custom validation
  } else if (typeof customValidation === 'object' && !customValidation.valid) {
    return customValidation;
  }

  return { valid: true, message: null };
}

function isBlank(value) {
  return value === '';
}

function isNotBlank(value) {
  return value !== '';
}

function isValidValue(validator, value) {
  return isBlank(value) || validator(value);
}

function isValidField(validator, field) {
  return isBlank(field.value) || validator(field.value);
}

function isValidRequiredField(validator, field) {
  return isNotBlank(field.value) && validator(field.value);
}

/**
 * Date Validations *
 */
function isValidYear(value) {
  return Number(value) >= minYear && Number(value) <= maxYear;
}

function isValidBirthYear(value) {
  return Number(value) >= minYear && Number(value) <= currentYear;
}

function isValidMonths(value) {
  return Number(value) >= 0;
}

function isBlankDateField(field) {
  return (
    isBlank(field.day.value) &&
    isBlank(field.month.value) &&
    isBlank(field.year.value)
  );
}

function isFullDate(date) {
  return /\d{4}-\d{1,2}-\d{1,2}/.test(date);
}

function isValidDate(day, month, year) {
  // Use the date class to see if the date parses back sanely as a
  // validation check. Not sure is a great idea...
  const adjustedMonth = Number(month) - 1; // JS Date object 0-indexes months. WTF.
  const date = new Date(year, adjustedMonth, day);
  const today = new Date();

  if (today < date) {
    return false;
  }

  if (!isValidYear(year)) {
    return false;
  }

  return (
    date.getDate() === Number(day) &&
    date.getMonth() === adjustedMonth &&
    date.getFullYear() === Number(year)
  );
}

function isValidBirthDate(day, month, year) {
  return isValidDate(day, month, year) && isValidBirthYear(year);
}

function isNotBlankDateField(field) {
  return (
    isNotBlank(field.day.value) &&
    isNotBlank(field.month.value) &&
    isNotBlank(field.year.value)
  );
}

function isDirtyDate(date) {
  return date.day.dirty && date.year.dirty && date.month.dirty;
}

function validateIfDirtyDate(dayField, monthField, yearField, validator) {
  if (isDirtyDate({ day: dayField, month: monthField, year: yearField })) {
    return validator(dayField.value, monthField.value, yearField.value);
  }

  return true;
}

function isValidDateRange(fromDate, toDate) {
  if (isBlankDateField(toDate) || isBlankDateField(fromDate)) {
    return true;
  }
  const momentStart = dateToMoment(fromDate);
  const momentEnd = dateToMoment(toDate);

  return momentStart.isBefore(momentEnd);
}

function isBlankMonthYear(field) {
  return isBlank(field.month.value) && isBlank(field.year.value);
}

/**
 * Field Validations *
 */
function isValidName(value) {
  return /^[a-zA-Z][a-zA-Z '-]*$/.test(value);
}

function isValidFullNameField(field) {
  return (
    isValidName(field.first.value) &&
    (isBlank(field.middle.value) || isValidName(field.middle.value)) &&
    isValidName(field.last.value)
  );
}

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
function isValidSSN(value) {
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

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^\d+\.?\d*$/.test(value);
  }
  return true;
}

// TODO: look into validation libraries (npm "validator")
function isValidPhone(value) {
  // Strip spaces, dashes, and parens
  const stripped = value.replace(/[^\d]/g, '');
  // Count number of digits
  return /^\d{10}$/.test(stripped);
}

function isValidEmail(value) {
  // Comes from StackOverflow: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  // eslint-disable-next-line no-useless-escape
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value,
  );
}

// Checks for a zipcode of valid length; use isValidUSZipCode if you need to
// include the zipcode + 4
function isValidZipcode(value) {
  const stripped = (value || '').replace(/[^\d]/g, '');
  return stripped.length === 5;
}

// Pulled from https://en.wikipedia.org/wiki/Routing_transit_number#Check_digit
function isValidRoutingNumber(value) {
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

// validator to prevent users from entering just whitespace on required fields
function validateWhiteSpace(errors, input) {
  if (typeof input !== 'undefined' && !/\S/.test(input)) {
    errors.addError('You must provide a response');
  }
}

function validateDateOfBirth(errors, dateString) {
  const dateArray = dateString.split('-');
  const yearString = dateArray[0];
  const monthString = dateArray[1];
  const dayString = dateArray[2];

  if (!isValidBirthDate(dayString, monthString, yearString)) {
    errors.addError(
      `Please provide a valid date of birth, with Year between ${minYear} and ${currentYear}.`,
    );
  }
}

/**
 * Returns a validator that checks the input length.
 * Used like: 'ui:validations': [validateLength(50)]
 */
function validateLength(
  length,
  message = `This field should be less than ${length} characters.`,
) {
  return function hasValidLength(errors, input) {
    if (input.length > length) {
      errors.addError(message);
    }
    validateWhiteSpace(errors, input);
  };
}

export {
  isBlank,
  isBlankDateField,
  isBlankMonthYear,
  isDirtyDate,
  isFullDate,
  isNotBlank,
  isNotBlankDateField,
  isValidBirthDate,
  isValidBirthYear,
  isValidDate,
  isValidDateRange,
  isValidEmail,
  isValidFullNameField,
  isValidField,
  isValidMonths,
  isValidName,
  isValidMonetaryValue,
  isValidPhone,
  isValidRequiredField,
  isValidSSN,
  isValidValue,
  isValidZipcode,
  validateCustomFormComponent,
  validateDateOfBirth,
  validateIfDirty,
  validateIfDirtyDate,
  validateLength,
  isValidRoutingNumber,
  validateWhiteSpace,
};
