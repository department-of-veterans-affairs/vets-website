import { isValidEmail } from 'platform/forms/validations';

function isValidPhone(value) {
  let stripped;
  try {
    stripped = value.replace(/[^\d]/g, '');
  } catch (err) {
    stripped = value;
  }
  return /^\d{10}$/.test(stripped);
}

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
