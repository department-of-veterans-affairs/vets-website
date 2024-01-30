import { isValidEmail, isValidRoutingNumber } from 'platform/forms/validations';
import moment from 'moment';
import { formatReadableDate } from '../helpers';
import { formFields } from '../constants';

export const isValidPhone = (phone, isInternational) => {
  let stripped;
  try {
    stripped = phone.replace(/[^\d]/g, '');
  } catch (err) {
    stripped = phone;
  }
  return isInternational
    ? /^\d{10,15}$/.test(stripped)
    : /^\d{10}$/.test(stripped);
};

const validatePhone = (errors, phone, isInternational) => {
  if (phone && !isValidPhone(phone, isInternational)) {
    const numDigits = isInternational ? '10 to 15' : '10';
    errors.addError(
      `Please enter a ${numDigits}-digit phone number (with or without dashes)`,
    );
  }
};

export const validateHomePhone = (errors, phone, formData) => {
  const { isInternational } = formData[formFields.viewPhoneNumbers].phoneNumber;
  validatePhone(errors, phone, isInternational);
};

export const validateMobilePhone = (errors, phone, formData) => {
  if (phone?.length === 0) return;

  const { isInternational } = formData[
    formFields.viewPhoneNumbers
  ].mobilePhoneNumber;
  validatePhone(errors, phone, isInternational);
};

export const validateEmail = (errors, email) => {
  if (email && !isValidEmail(email)) {
    errors.addError('Please enter a valid email address.');
  }
};

export const validateEffectiveDate = (errors, dateString) => {
  const effectiveDate = moment(dateString);
  const minDate = moment().subtract(1, 'year');
  const maxDate = moment().add(180, 'day');

  if (
    effectiveDate.isBefore(minDate, 'day') ||
    effectiveDate.isAfter(maxDate, 'day')
  ) {
    errors.addError(
      `Please enter a date between ${formatReadableDate(
        minDate.format('YYYY-MM-DD'),
      )} and ${formatReadableDate(maxDate.format('YYYY-MM-DD'))}`,
    );
  }
};

const isValidAccountNumber = accountNumber => {
  return /^[a-z0-9]+$/.test(accountNumber);
};

export const validateBankAccountNumber = (
  errors,
  accountNumber,
  formData,
  schema,
  errorMessages,
) => {
  const accountNumberRegex = new RegExp(schema.pattern);
  const isValidObfuscated = accountNumberRegex.test(accountNumber.trim());

  const bankAccount = formData[formFields.bankAccount];
  const matchesOriginal =
    accountNumber.trim() === bankAccount[formFields.originalAccountNumber];
  const routingNumberMatchesOriginal =
    bankAccount[formFields.routingNumber] ===
    bankAccount[formFields.originalRoutingNumber];

  if (
    !isValidAccountNumber(accountNumber) &&
    !(isValidObfuscated && matchesOriginal && routingNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};

export const validateRoutingNumber = (
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) => {
  const rountingNumberRegex = new RegExp(schema.pattern);
  const isValidObfuscated = rountingNumberRegex.test(routingNumber.trim());

  const bankAccount = formData[formFields.bankAccount];
  const matchesOriginal =
    routingNumber.trim() === bankAccount[formFields.originalRoutingNumber];
  const accountNumberMatchesOriginal =
    bankAccount[formFields.accountNumber] ===
    bankAccount[formFields.originalAccountNumber];

  if (
    !isValidRoutingNumber(routingNumber) &&
    !(isValidObfuscated && matchesOriginal && accountNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};

export const duplicateArrays = (array1, array2) => {
  if (array1?.length !== array2?.length) {
    return false;
  }
  for (let i = 0; i < array1?.length; i += 1) {
    const keys1 = Object.keys(array1[i]);
    const keys2 = Object.keys(array2[i]);
    if (keys1?.length !== keys2?.length) {
      return false;
    }
    for (let j = 0; j < keys1?.length; j += 1) {
      const key = keys1[j];
      if (array1[i][key] !== array2[i][key]) {
        return false;
      }
    }
  }
  return true;
};
