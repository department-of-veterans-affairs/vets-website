import { apiRequest } from '../../../common/helpers/api';
import { isValidEmail, isValidPhone } from '../../../common/utils/validations';

export const OPEN_MODAL = 'OPEN_MODAL';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';

export const FETCH_VA_PROFILE = 'FETCH_VA_PROFILE';
export const FETCH_VA_PROFILE_FAIL = 'FETCH_VA_PROFILE_FAIL';
export const FETCH_VA_PROFILE_SUCCESS = 'FETCH_VA_PROFILE_SUCCESS';

export const SAVE_MAILING_ADDRESS = 'SAVE_MAILING_ADDRESS';
export const SAVE_MAILING_ADDRESS_FAIL = 'SAVE_MAILING_ADDRESS_FAIL';
export const SAVE_MAILING_ADDRESS_SUCCESS = 'SAVE_MAILING_ADDRESS_SUCCESS';

export const SAVE_RESIDENTIAL_ADDRESS = 'SAVE_RESIDENTIAL_ADDRESS';
export const SAVE_RESIDENTIAL_ADDRESS_FAIL = 'SAVE_RESIDENTIAL_ADDRESS_FAIL';
export const SAVE_RESIDENTIAL_ADDRESS_SUCCESS = 'SAVE_RESIDENTIAL_ADDRESS_SUCCESS';

export const SAVE_PRIMARY_PHONE = 'SAVE_PRIMARY_PHONE';
export const SAVE_PRIMARY_PHONE_FAIL = 'SAVE_PRIMARY_PHONE_FAIL';
export const SAVE_PRIMARY_PHONE_SUCCESS = 'SAVE_PRIMARY_PHONE_SUCCESS';

export const SAVE_ALTERNATE_PHONE = 'SAVE_ALTERNATE_PHONE';
export const SAVE_ALTERNATE_PHONE_FAIL = 'SAVE_ALTERNATE_PHONE_FAIL';
export const SAVE_ALTERNATE_PHONE_SUCCESS = 'SAVE_ALTERNATE_PHONE_SUCCESS';

export const SAVE_EMAIL_ADDRESS = 'SAVE_EMAIL_ADDRESS';
export const SAVE_EMAIL_ADDRESS_FAIL = 'SAVE_EMAIL_ADDRESS_FAIL';
export const SAVE_EMAIL_ADDRESS_SUCCESS = 'SAVE_EMAIL_ADDRESS_SUCCESS';

function updateProfileFormField(field, validator) {
  return (value, dirty) => {
    const errorMessage = validator && dirty ? validator(value) : '';
    return {
      type: UPDATE_PROFILE_FORM_FIELD,
      field,
      newState: {
        value,
        errorMessage
      }
    };
  };
}

// @todo once the endpoints are built we can actually send an API request.
function saveFieldHandler(apiRoute, requestStartAction, requestSuccessAction) {
  return fieldValue => {
    return dispatch => {
      dispatch({ type: requestStartAction });

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(dispatch({ type: requestSuccessAction, newValue: fieldValue }));
        }, 2000);
      });
    };
  };
}

async function sendProfileRequests() {
  const result = {};
  const requests = [
    ['email', '/profile/email'],
    ['primaryTelephone', '/profile/primary_phone'],
    ['alternateTelephone', '/profile/alternate_phone'],
    ['mailingAddress', '/profile/mailing_address'],
    ['serviceHistory', '/profile/service_history']
  ];

  /* eslint-disable no-await-in-loop */
  for (const [property, url] of requests) {
    try {
      const response = await apiRequest(url);
      result[property] = response.data.attributes;
    } catch (err) {
      // Allow the property to remain undefined
    }
  }

  return result;
}

function combineWithMockData(profile, realData) {
  return {
    ...realData,
    userFullName: profile.userFullName,
    dob: profile.dob,
    gender: profile.gender,
    ssn: 'XXXXX1232'
  };
}

export function fetchVaProfile() {
  return async (dispatch, getState) => {
    const { user: { profile } } = getState();
    dispatch({ type: FETCH_VA_PROFILE });
    try {
      const vaProfile = await sendProfileRequests();
      const withMocked = combineWithMockData(profile, vaProfile);
      dispatch({ type: FETCH_VA_PROFILE_SUCCESS, newState: withMocked });
    } catch (err) {
      dispatch({ type: FETCH_VA_PROFILE_FAIL });
    }
  };
}

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

function validateEmail({ email }) {
  return isValidEmail(email) ? '' : 'Please enter a valid email.';
}

function validateTelephone({ number }) {
  return isValidPhone(number) ? '' : 'Please enter a valid phone.';
}

export const updateFormField = {
  email: updateProfileFormField('email', validateEmail),
  mailingAddress: updateProfileFormField('mailingAddress'),
  primaryTelephone: updateProfileFormField('primaryTelephone', validateTelephone),
  alternateTelephone: updateProfileFormField('alternateTelephone', validateTelephone)
};

export const saveField = {
  updateEmailAddress: saveFieldHandler(
    '/v0/email',
    SAVE_EMAIL_ADDRESS,
    SAVE_EMAIL_ADDRESS_SUCCESS,
    SAVE_EMAIL_ADDRESS_FAIL),

  updatePrimaryPhone: saveFieldHandler(
    '/v0/phone/primary',
    SAVE_PRIMARY_PHONE,
    SAVE_PRIMARY_PHONE_SUCCESS,
    SAVE_PRIMARY_PHONE_FAIL),

  updateAlternatePhone: saveFieldHandler(
    '/v0/phone/alternate',
    SAVE_ALTERNATE_PHONE,
    SAVE_ALTERNATE_PHONE_SUCCESS,
    SAVE_ALTERNATE_PHONE_FAIL),

  updateMailingAddress: saveFieldHandler(
    '/v0/address/mailing',
    SAVE_MAILING_ADDRESS,
    SAVE_MAILING_ADDRESS_SUCCESS,
    SAVE_MAILING_ADDRESS_FAIL)
};
