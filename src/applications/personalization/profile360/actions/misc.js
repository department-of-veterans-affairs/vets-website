import { isValidEmail, isValidPhone } from '../../../../platform/forms/validations';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLEAR_PROFILE_ERRORS = 'CLEAR_PROFILE_ERRORS';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

export function clearErrors() {
  return { type: CLEAR_PROFILE_ERRORS };
}

export function clearMessage() {
  return { type: CLEAR_MESSAGE };
}

function validateEmail({ email }) {
  return isValidEmail(email) ? '' : 'Please enter a valid email.';
}

function validateTelephone({ number }) {
  return isValidPhone(number) ? '' : 'Please enter a valid phone.';
}

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
    areaCode,
    countryCode,
    extension,
    phoneType,
    phoneNumber,
  } = value;

  return {
    areaCode,
    countryCode,
    extension,
    phoneType,
    phoneNumber,
    isInternational: countryCode !== '1',
  };
}

function cleanAddressDataForUpdate(value) {
  const {
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryName,
    stateCode,
    zipCode,
  } = value;

  return {
    addressLine1,
    addressLine2,
    addressLine3,
    addressPou,
    addressType,
    city,
    countryName,
    stateCode,
    zipCode,
  };
}


function updateProfileFormField(field, validator, type) {
  return (value, dirty) => {
    const errorMessage = validator && dirty ? validator(value) : '';

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


    return {
      type: UPDATE_PROFILE_FORM_FIELD,
      field,
      newState: {
        value: cleanValue,
        errorMessage
      }
    };
  };
}

export const updateFormField = {
  email: updateProfileFormField('email', validateEmail, 'email'),
  faxNumber: updateProfileFormField('faxNumber', validateTelephone, 'phone'),
  homePhone: updateProfileFormField('homePhone', validateTelephone, 'phone'),
  mailingAddress: updateProfileFormField('mailingAddress', null, 'address'),
  mobilePhone: updateProfileFormField('mobilePhone', validateTelephone, 'phone'),
  residentialAddress: updateProfileFormField('residentialAddress', null, 'address'),
  temporaryPhone: updateProfileFormField('temporaryPhone', validateTelephone, 'phone'),
  workPhone: updateProfileFormField('workPhone', validateTelephone, 'phone'),
};
