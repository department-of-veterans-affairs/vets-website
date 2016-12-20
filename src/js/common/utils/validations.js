import _ from 'lodash';
import moment from 'moment';
import { states } from './options-for-select';

function validateIfDirty(field, validator) {
  if (field.dirty) {
    return validator(field.value);
  }

  return true;
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

function isNotBlankDateField(field) {
  return isNotBlank(field.day.value) && isNotBlank(field.month.value) && isNotBlank(field.year.value);
}

// Conditions for valid SSN from the original 1010ez pdf form:
// '123456789' is not a valid SSN
// A value where the first 3 digits are 0 is not a valid SSN
// A value where the 4th and 5th digits are 0 is not a valid SSN
// A value where the last 4 digits are 0 is not a valid SSN
// A value with 3 digits, an optional -, 2 digits, an optional -, and 4 digits is a valid SSN
// 9 of the same digits (e.g., '111111111') is not a valid SSN
function isValidSSN(value) {
  if (value === '123456789' || value === '123-45-6789') {
    return false;
  } else if (/^0{3}-?\d{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?0{2}-?\d{4}$/.test(value)) {
    return false;
  } else if (/^\d{3}-?\d{2}-?0{4}$/.test(value)) {
    return false;
  }

  const noBadSameDigitNumber = _.without(_.range(0, 10), 2, 4, 5)
    .every(i => {
      const sameDigitRegex = new RegExp(`${i}{3}-?${i}{2}-?${i}{4}`);
      return !sameDigitRegex.test(value);
    });

  if (!noBadSameDigitNumber) {
    return false;
  }

  return /^\d{3}-?\d{2}-?\d{4}$/.test(value);
}

function isValidYear(value) {
  return Number(value) >= 1900 && Number(value) <= moment().add(100, 'year').year();
}

function isValidDate(day, month, year) {
  // Use the date class to see if the date parses back sanely as a
  // validation check. Not sure is a great idea...
  const adjustedMonth = Number(month) - 1;  // JS Date object 0-indexes months. WTF.
  const date = new Date(year, adjustedMonth, day);
  const today = new Date();

  if (today < date) {
    return false;
  }

  if (!isValidYear(year)) {
    return false;
  }

  return date.getDate() === Number(day) &&
    date.getMonth() === adjustedMonth &&
    date.getFullYear() === Number(year);
}

function isValidAnyDate(day, month, year) {
  if (!isValidYear(year)) {
    return false;
  }

  return moment({
    day,
    month: month ? parseInt(month, 10) - 1 : month,
    year
  }).isValid();
}

function isValidPartialDate(day, month, year) {
  if (year && !isValidYear(year)) {
    return false;
  }

  return true;
}

function isValidPartialMonthYear(month, year) {
  if (typeof month === 'object') {
    throw new Error('Pass a month and a year to function');
  }
  if (month && (Number(month) > 12 || Number(month) < 1)) {
    return false;
  }

  return isValidPartialDate(null, null, year);
}

function isValidPartialMonthYearInPast(month, year) {
  if (typeof month === 'object') {
    throw new Error('Pass a month and a year to function');
  }
  const momentDate = moment({ year, month: month ? parseInt(month, 10) - 1 : null });

  return !year || isValidPartialMonthYear(month, year) && momentDate.isValid() && momentDate.isSameOrBefore(moment().startOf('month'));
}

function isValidDateOver17(day, month, year) {
  if (!isValidYear(year)) {
    return false;
  }

  const momentDate = moment({
    day,
    month: parseInt(month, 10) - 1,
    year
  });
  return momentDate.isBefore(moment().endOf('day').subtract(17, 'years'));
}

function isValidName(value) {
  return /^[a-zA-Z][a-zA-Z '\-]*$/.test(value);
}

function isValidMonetaryValue(value) {
  if (value !== null) {
    return /^\d+\.?\d*$/.test(value);
  }
  return true;
}

function isValidUSZipCode(value) {
  return /(^\d{5}$)|(^\d{5}[ -]{0,1}\d{4}$)/.test(value);
}

function isValidCanPostalCode(value) {
  return /^[a-zA-Z]\d[a-zA-Z][ -]{0,1}\d[a-zA-Z]\d$/.test(value);
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
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}

function isValidField(validator, field) {
  return isBlank(field.value) || validator(field.value);
}

function isValidRequiredField(validator, field) {
  return isNotBlank(field.value) && validator(field.value);
}

function isBlankDateField(field) {
  return isBlank(field.day.value) && isBlank(field.month.value) && isBlank(field.year.value);
}

function isValidDateField(field) {
  return isValidDate(field.day.value, field.month.value, field.year.value);
}

function isValidPartialDateField(field) {
  return isValidPartialDate(field.day.value, field.month.value, field.year.value);
}

function isValidFullNameField(field) {
  return isValidName(field.first.value) &&
    (isBlank(field.middle.value) || isValidName(field.middle.value)) &&
    isValidName(field.last.value);
}

function isValidAddressField(field) {
  const initialOk = isNotBlank(field.street.value) &&
    isNotBlank(field.city.value) &&
    isNotBlank(field.country.value);

  // if we have a defined list of values, they will
  // be set as the state and zipcode keys
  if (_.hasIn(states, field.country.value)) {
    return initialOk &&
      isNotBlank(field.state.value) &&
      isNotBlank(field.zipcode.value);
  }
  // if the entry was non-USA/CAN/MEX, only postal is
  // required, not provinceCode
  return initialOk && isNotBlank(field.postalCode.value);
}

function isBlankAddress(address) {
  return isBlank(address.city.value)
    && isBlank(address.state.value)
    && isBlank(address.street.value)
    && isBlank(address.postalCode.value);
}

function isValidEntryDateField(date, dateOfBirth) {
  let adjustedDate;
  let adjustedDateOfBirth;

  if (!isBlankDateField(date) && !isBlankDateField(dateOfBirth)) {
    const adjustedBirthYear = Number(dateOfBirth.year.value) + 15;
    adjustedDate = new Date(`${date.month.value}/${date.day.value}/${date.year.value}`);
    adjustedDateOfBirth = new Date(`${dateOfBirth.month.value}/${dateOfBirth.day.value}/${adjustedBirthYear}`);

    if (adjustedDate < adjustedDateOfBirth) {
      return false;
    }
  }

  return true;
}

function isValidDischargeDateField(date, entryDate) {
  let adjustedDate;
  let adjustedEntryDate;
  const d = new Date();
  const today = new Date(d.setHours(0, 0, 0, 0));

  if (!isBlankDateField(date) && !isBlankDateField(entryDate)) {
    adjustedDate = new Date(`${date.month.value}/${date.day.value}/${date.year.value}`);
    adjustedEntryDate = new Date(`${entryDate.month.value}/${entryDate.day.value}/${entryDate.year.value}`);

    // Validation Rule: Discharge date must be after entry date and before today
    if (adjustedDate < adjustedEntryDate || adjustedDate >= today) {
      return false;
    }
  }

  return true;
}

export {
  validateIfDirty,
  validateIfDirtyDate,
  isBlank,
  isBlankDateField,
  isNotBlank,
  isValidAddressField,
  isValidRequiredField,
  isValidDate,
  isValidDateField,
  isValidName,
  isValidSSN,
  isValidMonetaryValue,
  isValidUSZipCode,
  isValidCanPostalCode,
  isValidPhone,
  isValidEmail,
  isValidEntryDateField,
  isValidDischargeDateField,
  isValidFullNameField,
  isValidField,
  isBlankAddress,
  isValidAnyDate,
  isValidDateOver17,
  isDirtyDate,
  isNotBlankDateField,
  isValidPartialDate,
  isValidDateField,
  isValidPartialDateField,
  isValidPartialMonthYear,
  isValidYear,
  isValidPartialMonthYearInPast,
  validateCustomFormComponent
};
