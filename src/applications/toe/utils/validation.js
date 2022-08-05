import { isValidEmail } from 'platform/forms/validations';
import moment from 'moment';
import { formatReadableDate } from '../helpers';

export const isValidPhone = value => {
  let stripped;
  try {
    stripped = value.replace(/[^\d]/g, '');
  } catch (err) {
    stripped = value;
  }
  return /^\d{10}$/.test(stripped);
};

export const validatePhone = (errors, phone) => {
  if (phone && !isValidPhone(phone)) {
    errors.addError(
      'Please enter a 10-digit phone number (with or without dashes)',
    );
  }
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
