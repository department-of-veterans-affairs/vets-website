import { apiRequest } from '../../../../platform/utilities/api';
import recordEvent from '../../../../platform/monitoring/record-event';
import { kebabCase } from 'lodash';

export const SAVE_MAILING_ADDRESS = 'SAVE_MAILING_ADDRESS';
export const SAVE_MAILING_ADDRESS_FAIL = 'SAVE_MAILING_ADDRESS_FAIL';
export const SAVE_MAILING_ADDRESS_SUCCESS = 'SAVE_MAILING_ADDRESS_SUCCESS';

export const SAVE_HOME_PHONE = 'SAVE_HOME_PHONE';
export const SAVE_HOME_PHONE_FAIL = 'SAVE_HOME_PHONE_FAIL';
export const SAVE_HOME_PHONE_SUCCESS = 'SAVE_HOME_PHONE_SUCCESS';

export const SAVE_EMAIL_ADDRESS = 'SAVE_EMAIL_ADDRESS';
export const SAVE_EMAIL_ADDRESS_FAIL = 'SAVE_EMAIL_ADDRESS_FAIL';
export const SAVE_EMAIL_ADDRESS_SUCCESS = 'SAVE_EMAIL_ADDRESS_SUCCESS';

export const SAVE_MOBILE_PHONE = 'SAVE_MOBILE_PHONE';
export const SAVE_MOBILE_PHONE_FAIL = 'SAVE_MOBILE_PHONE_FAIL';
export const SAVE_MOBILE_PHONE_SUCCESS = 'SAVE_MOBILE_PHONE_SUCCESS';

export const SAVE_WORK_PHONE = 'SAVE_WORK_PHONE';
export const SAVE_WORK_PHONE_FAIL = 'SAVE_WORK_PHONE_FAIL';
export const SAVE_WORK_PHONE_SUCCESS = 'SAVE_WORK_PHONE_SUCCESS';

export const SAVE_TEMPORARY_PHONE = 'SAVE_TEMPORARY_PHONE';
export const SAVE_TEMPORARY_PHONE_FAIL = 'SAVE_TEMPORARY_PHONE_FAIL';
export const SAVE_TEMPORARY_PHONE_SUCCESS = 'SAVE_TEMPORARY_PHONE_SUCCESS';

export const SAVE_FAX_NUMBER = 'SAVE_FAX_NUMBER';
export const SAVE_FAX_NUMBER_FAIL = 'SAVE_FAX_NUMBER_FAIL';
export const SAVE_FAX_NUMBER_SUCCESS = 'SAVE_FAX_NUMBER_SUCCESS';

export const UPDATE_VET360_PROFILE_FIELD = 'UPDATE_VET360_PROFILE_FIELD';


function recordProfileTransaction(fieldName) {
  const names = [
    'mobile-phone',
    'primary-telephone',
    'mailing-address',
  ];

  if (names.includes(fieldName)) {
    recordEvent({
      event: 'profile-transaction',
      'profile-section': fieldName
    });
  }
}

function saveFieldHandler(apiRoute, fieldName, requestStartAction, requestSuccessAction, requestFailAction, method = 'POST') {
  return fieldValue => {
    return async dispatch => {
      const options = {
        body: JSON.stringify(fieldValue),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      dispatch({ type: requestStartAction });

      try {
        const response = await apiRequest(apiRoute, options);
        recordProfileTransaction(fieldName);
        dispatch({
          type: requestSuccessAction,
          fieldName,
          newValue: response.data.attributes
        });
      } catch (err) {
        dispatch({ type: requestFailAction });
      }
    };
  };
}

function updatePhoneHandler(fieldName, requestStartAction, requestSuccessAction, requestFailAction, method = 'POST') {
  return fieldValue => {
    return async dispatch => {
      const options = {
        body: JSON.stringify(fieldValue),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      dispatch({ type: requestStartAction });

      try {
        const response = await apiRequest('/profile/telephones', options);

        recordProfileTransaction(kebabCase(`${fieldValue.phoneType} phone`));

        // TODO: save transaction ID for status check
        // TODO: check metadata for actionable info
        console.log('transaction attributes', response.data.attributes);

        // update profile info on FE side
        dispatch({
          type: UPDATE_VET360_PROFILE_FIELD,
          fieldName,
          newValue: fieldValue,
        });
      } catch (err) {
        dispatch({ type: requestFailAction });
      }
    };
  };
}

export const saveField = {
  updateHomePhone: updatePhoneHandler(
    'homePhone',
    SAVE_HOME_PHONE,
    SAVE_HOME_PHONE_SUCCESS,
    SAVE_HOME_PHONE_FAIL),

  updateMobilePhone: updatePhoneHandler(
    'mobilePhone',
    SAVE_MOBILE_PHONE,
    SAVE_MOBILE_PHONE_SUCCESS,
    SAVE_MOBILE_PHONE_FAIL),

  updateWorkPhone: updatePhoneHandler(
    'workPhone',
    SAVE_WORK_PHONE,
    SAVE_WORK_PHONE_SUCCESS,
    SAVE_WORK_PHONE_FAIL),

  updateTemporaryPhone: updatePhoneHandler(
    'temporaryPhone',
    SAVE_TEMPORARY_PHONE,
    SAVE_TEMPORARY_PHONE_SUCCESS,
    SAVE_TEMPORARY_PHONE_FAIL),

  updateFaxNumber: updatePhoneHandler(
    'faxNumber',
    SAVE_FAX_NUMBER,
    SAVE_FAX_NUMBER_SUCCESS,
    SAVE_FAX_NUMBER_FAIL),

  updateEmailAddress: saveFieldHandler(
    '/profile/email',
    'email',
    SAVE_EMAIL_ADDRESS,
    SAVE_EMAIL_ADDRESS_SUCCESS,
    SAVE_EMAIL_ADDRESS_FAIL),

  updateMailingAddress: saveFieldHandler(
    '/profile/mailing_address',
    'mailingAddress',
    SAVE_MAILING_ADDRESS,
    SAVE_MAILING_ADDRESS_SUCCESS,
    SAVE_MAILING_ADDRESS_FAIL,
    'PUT')
};
