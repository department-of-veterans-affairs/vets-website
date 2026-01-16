import { isValidEmail, isValidRoutingNumber } from 'platform/forms/validations';
import moment from 'moment';
import { formatReadableDate } from '../helpers';

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
  const { isInternational } = formData?.homePhone;
  validatePhone(errors, phone, isInternational);
};

export const validateMobilePhone = (errors, phone, formData) => {
  if (phone?.length === 0) return;

  const { isInternational } = formData?.mobilePhone;
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

// Returns an error if the user only updates the unobfuscated digits of their account number OR routing number
// In such a scenario, they should either enter the full account number and routing number, or leave them unchanged
export const validateAccountNumber = (
  errors,
  accountNumber,
  formData,
  schema,
  errorMessages,
) => {
  if (!accountNumber) return;

  const accountNumberRegex = new RegExp(schema.pattern);
  const isValidObfuscated = accountNumberRegex.test(accountNumber.trim());

  const bankAccount = formData['view:directDeposit']?.bankAccount;
  const matchesOriginal =
    accountNumber.trim() === bankAccount.originalAccountNumber;
  const routingNumberMatchesOriginal =
    bankAccount.routingNumber === bankAccount.originalRoutingNumber;

  if (
    !isValidAccountNumber(accountNumber) &&
    !(isValidObfuscated && matchesOriginal && routingNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};

// Returns an error if the user only updates the unobfuscated digits of their routing number OR account number
// In such a scenario, they should either enter the full routing number and account number, or leave them unchanged
export const validateRoutingNumber = (
  errors,
  routingNumber,
  formData,
  schema,
  errorMessages,
) => {
  if (!routingNumber) return;

  const routingNumberRegex = new RegExp(schema.pattern);
  const isValidObfuscated = routingNumberRegex.test(routingNumber.trim());

  const bankAccount = formData['view:directDeposit']?.bankAccount;
  const matchesOriginal =
    routingNumber.trim() === bankAccount.originalRoutingNumber;
  const accountNumberMatchesOriginal =
    bankAccount.accountNumber === bankAccount.originalAccountNumber;

  if (
    !isValidRoutingNumber(routingNumber) &&
    !(isValidObfuscated && matchesOriginal && accountNumberMatchesOriginal)
  ) {
    errors.addError(errorMessages.pattern);
  }
};
