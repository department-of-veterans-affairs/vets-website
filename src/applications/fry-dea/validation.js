import { isValidEmail } from 'platform/forms/validations';
import { newFormFields } from './constants';

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
  const { isInternational } = formData[newFormFields.newViewPhoneNumbers][
    newFormFields.newPhoneNumber
  ];

  validatePhone(errors, phone, isInternational);
};

export const validateMobilePhone = (errors, phone, formData) => {
  const { isInternational } = formData[newFormFields.newViewPhoneNumbers][
    newFormFields.newMobilePhoneNumber
  ];
  validatePhone(errors, phone, isInternational);
};

export const validateEmail = (errors, email) => {
  if (email && !isValidEmail(email)) {
    errors.addError('Please enter a valid email address.');
  }
};
