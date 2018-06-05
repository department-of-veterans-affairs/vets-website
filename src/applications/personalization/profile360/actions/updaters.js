import { apiRequest } from '../../../../platform/utilities/api';
import recordEvent from '../../../../platform/monitoring/record-event';
import { kebabCase } from 'lodash';

import localVet360, { isVet360Configured } from '../util/local-vet360';
import * as VET360_CONSTANTS from '../constants/vet360';

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

export const VET360_TRANSACTION_REQUESTED = 'VET360_TRANSACTION_REQUESTED';
export const VET360_TRANSACTION_REQUEST_FAILED = 'VET360_TRANSACTION_REQUEST_FAILED';
export const VET360_TRANSACTION_REQUEST_SUCCEEDED = 'VET360_TRANSACTION_REQUEST_SUCCEEDED';
export const VET360_TRANSACTION_UPDATED = 'VET360_TRANSACTION_UPDATED';
export const VET360_TRANSACTION_FINISHED = 'VET360_TRANSACTION_FINISHED';

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

export function getTransactionStatus(transaction, fieldName) {
  return async (dispatch, getState) => {
    try {
      const { transactionId } = transaction.data.attributes;
      const response = isVet360Configured() ? await apiRequest(`/profile/status/${transactionId}`) : localVet360.updateTransaction(transactionId);

      dispatch({
        type: VET360_TRANSACTION_UPDATED,
        response,
        fieldName
      });

      // Check to see if the transaction is finished
      if (response.data.attributes.transactionStatus === VET360_CONSTANTS.TRANSACTION_STATUS.COMPLETED_SUCCESS) {
        const currentState = getState();
        const newValue = currentState.vaProfile.formFields[fieldName].value;

        // Remove the transaction with a delay for effect
        setTimeout(() => {
          dispatch({
            type: VET360_TRANSACTION_FINISHED,
            fieldName
          });
        }, 3000);

        // Update the property on the FE
        dispatch({
          type: UPDATE_VET360_PROFILE_FIELD,
          fieldName,
          newValue
        });
      }
    } catch (err) {
      // Just allow the former transaction status to remain in the store in the event of an error.
    }
  };
}

function updateVet360Field(apiRoute, fieldName) {
  return fieldValue => {
    return async (dispatch, getState) => {
      const currentState = getState();
      const currentFieldValue = currentState.user.profile.vet360[fieldName];
      const method = currentFieldValue === null ? 'POST' : 'PUT';
      const options = {
        body: JSON.stringify(fieldValue),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        dispatch({
          type: VET360_TRANSACTION_REQUESTED,
          fieldName
        });

        const response = isVet360Configured() ? await apiRequest(apiRoute, options) : localVet360.createTransaction();

        if (apiRoute === '/profile/telephones') {
          recordProfileTransaction(kebabCase(`${fieldValue.phoneType} phone`));
        }

        dispatch({
          type: VET360_TRANSACTION_REQUEST_SUCCEEDED,
          fieldName,
          response
        });
      } catch (error) {
        dispatch({
          type: VET360_TRANSACTION_REQUEST_FAILED,
          error,
          fieldName
        });
      }
    };
  };
}

export const saveField = {
  updateHomePhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.HOME_PHONE),
  updateMobilePhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.MOBILE_PHONE),
  updateWorkPhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.WORK_PHONE),
  updateTemporaryPhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.TEMP_PHONE),
  updateFaxNumber: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.FAX_NUMBER),
  updateEmailAddress: updateVet360Field('/profile/email', VET360_CONSTANTS.FIELD_NAMES.EMAIL),
  updateMailingAddress: updateVet360Field('/profile/mailing_address', VET360_CONSTANTS.FIELD_NAMES.MAILING_ADDRESS)
};
