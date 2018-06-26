import { isValidEmail, isValidPhone } from '../../../../platform/forms/validations';
import { MILITARY_STATES } from '../../../letters/utils/constants';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

function validateEmail({ emailAddress: email }) {
  return {
    emailAddress: email && isValidEmail(email) ? '' : 'Please enter your email address again, following a standard format like name@domain.com.'
  };
}

function validateTelephone({ inputPhoneNumber }) {
  return {
    inputPhoneNumber: inputPhoneNumber && isValidPhone(inputPhoneNumber) ? '' : 'Please enter a valid phone.'
  };
}

function inferAddressType(countryName, stateCode) {
  let addressType = 'DOMESTIC';
  if (countryName !== 'United States') {
    addressType = 'INTERNATIONAL';
  } else if (MILITARY_STATES.has(stateCode)) {
    addressType = 'MILITARY OVERSEAS';
  }

  return addressType;
}

function validateAddress({ addressLine1, city, stateCode,  internationalPostalCode, zipCode, countryName }, fieldName) {
  const isInternational = inferAddressType(countryName, stateCode) === 'INTERNATIONAL';
  const validateAll = !fieldName;

  return {
    addressLine1: (fieldName === 'addressLine1' || validateAll) && !addressLine1 ? 'Street address is required' : '',
    city: (fieldName === 'city' || validateAll) && !city ? 'City is required' : '',
    stateCode: (fieldName === 'stateCode' || validateAll) && !isInternational && !stateCode ? 'State is required' : '',
    zipCode: (fieldName === 'zipCode' || validateAll) && !isInternational && !zipCode ? 'Zip code is required' : '',
    internationalPostalCode: (fieldName === 'internationalPostalCode' || validateAll) && isInternational && !internationalPostalCode ? 'Postal code is required' : '',
  };
}

// @todo It might be cleaner to have this in the edit-modals themselves rather than here.
function cleanEmailDataForUpdate(value) {
  const {
    id,
    emailAddress,
  } = value;

  return {
    id,
    emailAddress,
  };
}

function cleanPhoneDataForUpdate(value) {
  const {
    id,
    countryCode,
    extension,
    phoneType,
    inputPhoneNumber,
  } = value;

  const strippedPhone = (inputPhoneNumber || '').replace(/[^\d]/g, '');
  const strippedExtension = (extension || '').replace(/[^a-zA-Z0-9]/g, '');

  return {
    id,
    areaCode: strippedPhone.substring(0, 3),
    countryCode,
    extension: strippedExtension,
    phoneType,
    phoneNumber: strippedPhone.substring(3),
    isInternational: countryCode !== '1',
    inputPhoneNumber,
  };
}

function cleanAddressDataForUpdate(value) {
  const {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    city,
    countryName,
    stateCode,
    zipCode,
    internationalPostalCode,
    province,
  } = value;

  const addressType = inferAddressType(countryName, stateCode);

  return {
    id,
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryName,
    province: addressType === 'INTERNATIONAL' ? province : null,
    stateCode: addressType === 'INTERNATIONAL' ? null : stateCode,
    zipCode: addressType !== 'INTERNATIONAL' ? zipCode : null,
    internationalPostalCode: addressType === 'INTERNATIONAL' ? internationalPostalCode : null,
  };
}

function updateProfileFormField(field, validator, type) {
  return (value, fieldName, skipValidation) => {
    let cleanValue = value;

    switch (type) {
      case 'email':
        cleanValue = cleanEmailDataForUpdate(value);
        break;
      case 'phone':
        cleanValue = cleanPhoneDataForUpdate(value);
        break;
      case 'address':
        cleanValue = cleanAddressDataForUpdate(value);
        break;
      default:
    }

    const validations = validator && !skipValidation ? validator(cleanValue, fieldName) : {};

    return {
      type: UPDATE_PROFILE_FORM_FIELD,
      field,
      newState: {
        value: cleanValue,
        validations
      }
    };
  };
}

export const updateFormField = {
  email: updateProfileFormField('email', validateEmail, 'email'),
  faxNumber: updateProfileFormField('faxNumber', validateTelephone, 'phone'),
  homePhone: updateProfileFormField('homePhone', validateTelephone, 'phone'),
  mailingAddress: updateProfileFormField('mailingAddress', validateAddress, 'address'),
  mobilePhone: updateProfileFormField('mobilePhone', validateTelephone, 'phone'),
  residentialAddress: updateProfileFormField('residentialAddress', validateAddress, 'address'),
  temporaryPhone: updateProfileFormField('temporaryPhone', validateTelephone, 'phone'),
  workPhone: updateProfileFormField('workPhone', validateTelephone, 'phone'),
};
