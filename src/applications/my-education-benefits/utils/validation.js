import { isValidPhone, isValidEmail } from 'platform/forms/validations';

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

export function validatePhoneErr(
  errors,
  phone,
  formData,
  schema,
  errorMessages = {},
) {
  const {
    phoneError = 'Please enter a 10-digit phone number (with or without dashes)',
  } = errorMessages;
  if (isValidPhone(phone)) {
    errors.addError(phoneError);
  }
}
