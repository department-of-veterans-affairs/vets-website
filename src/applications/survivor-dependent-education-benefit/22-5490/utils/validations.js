import { isValidEmail } from 'platform/forms/validations';
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
