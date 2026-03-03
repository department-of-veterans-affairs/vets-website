import { fullNameReducer } from '~/platform/forms/components/review/PreSubmitSection';
import { ADDRESS_TYPES } from 'platform/forms/address/helpers';

export function fullNameToString(fullName) {
  return `${fullName.first || ''}${
    fullName.middle ? ` ${fullName.middle}` : ''
  } ${fullName.last || ''}`;
}

export function validateNameMatchesUser(errors, fieldData, formData) {
  const expectedName = fullNameToString(formData.applicantName);
  if (fullNameReducer(expectedName) !== fullNameReducer(fieldData)) {
    errors.addError(
      `Enter your name exactly as it appears on your form: ${expectedName}`,
    );
  }
}

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

export const transformContactInfoMailingAddress = (addr = {}) => {
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

export const todaysDate = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  const today = new Date(date.getTime() - offset * 60 * 1000);
  return today.toISOString().split('T')[0];
};
