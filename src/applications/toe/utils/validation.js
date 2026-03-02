import { isValidEmail, isValidRoutingNumber } from 'platform/forms/validations';
import moment from 'moment';
import { formatReadableDate } from '../helpers';
import { formFields } from '../constants';

export const nameErrorMessage = maxLength =>
  `Please enter a valid entry. Acceptable entries are letters, spaces, hyphens, and apostrophes and can't be more than ${maxLength} characters.`;

/**
 * Validates a first/middle name.  Acceptable entries are letters,
 * spaces, hyphens, and apostrophes between 1 and 20 characters.
 * Leading and trailing whitespace are not counted.  The first
 * character must be a letter.
 * @param {string} name The first/middle name.
 * @returns boolean Is the first/middle name valid?
 */
export const isValidGivenName = name => {
  return name && /^\s*[a-zA-Z]{1}[a-zA-Z '’-]{0,19}\s*$/.test(name);
};

/**
 * Validates a last name.  Acceptable entries are letters, spaces
 * hyphens, and apostrophes between 1 and 26 characters.  Leading and
 * trailing whitespace are not counted.
 * @param {string} lastName The last name.
 * @returns boolean Is last name valid?
 */
export const isValidLastName = lastName => {
  return lastName && /^\s*[a-zA-Z]{1}[a-zA-Z '’-]{0,25}\s*$/.test(lastName);
};

const isValidPhone = (phone, isInternational) => {
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

export const isValidPhoneField = phoneField => {
  const { isInternational } = phoneField;
  return isValidPhone(phoneField.phone, isInternational);
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
  const { isInternational } = formData[formFields.viewPhoneNumbers][
    formFields.phoneNumber
  ];

  validatePhone(errors, phone, isInternational);
};

export const validateMobilePhone = (errors, phone, formData) => {
  const { isInternational } = formData[formFields.viewPhoneNumbers][
    formFields.mobilePhoneNumber
  ];
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

export const validateAccountNumber = (
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
  const routingNumberRegex = new RegExp(schema.pattern);
  const isValidObfuscated = routingNumberRegex.test(routingNumber.trim());

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
