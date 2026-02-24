import { ADDRESS_TYPES } from 'platform/forms/address/helpers';
import { isValidDateString } from 'platform/utilities/date';

export const validatePrepCourseStartDate = (errors, fieldData, formData) => {
  if (!fieldData) return;

  if (!isValidDateString(fieldData)) errors.addError('Enter a valid date');

  if (!isValidDateString(formData.prepCourseEndDate)) return;

  const start = new Date(formData.prepCourseStartDate);
  const end = new Date(formData.prepCourseEndDate);

  if (end < start) {
    errors.addError('The start date cannot be after the end date');
  }
  if (
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate()
  ) {
    errors.addError('The start date and end date cannot be the same');
  }
};

export const todaysDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const today = new Date(date.getTime() - offset * 60 * 1000);
  return today.toISOString().split('T')[0];
};

export const transformPhoneNumberObject = (phone = {}) => {
  const { isInternational, areaCode, phoneNumber, countryCode } = phone;

  if (!phoneNumber || !areaCode) {
    return '';
  }

  let base = `${areaCode}${phoneNumber}`;
  if (isInternational && countryCode) {
    base = `+${countryCode} ${base}`;
  }

  return base;
};

export const transformMailingAddress = (addr = {}) => {
  const {
    addressType,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    countryCodeIso3,
    stateCode,
    internationalPostalCode,
    province,
    zipCode,
  } = addr;

  return {
    isMilitary: addressType === ADDRESS_TYPES.military,
    street: addressLine1,
    street2: addressLine2,
    street3: addressLine3,
    city,
    state: addressType === ADDRESS_TYPES.international ? province : stateCode,
    postalCode:
      addressType === ADDRESS_TYPES.international
        ? internationalPostalCode
        : zipCode,
    country: countryCodeIso3,
  };
};
