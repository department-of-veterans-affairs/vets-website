import { apiRequest } from '../../../../platform/utilities/api';
import recordEvent from '../../../../platform/monitoring/record-event';
import { kebabCase, uniqueId } from 'lodash';

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
export const VET360_TRANSACTION_BEGUN = 'VET360_TRANSACTION_BEGUN';
export const VET360_TRANSACTION_UPDATE = 'VET360_TRANSACTION_UPDATE';
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

// function saveFieldHandler(apiRoute, fieldName, requestStartAction, requestSuccessAction, requestFailAction, method = 'POST') {
//   return fieldValue => {
//     return async dispatch => {
//       const options = {
//         body: JSON.stringify(fieldValue),
//         method,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       };

//       dispatch({ type: requestStartAction });

//       try {
//         const response = await apiRequest(apiRoute, options);
//         recordProfileTransaction(fieldName);
//         dispatch({
//           type: requestSuccessAction,
//           fieldName,
//           newValue: response.data.attributes
//         });
//       } catch (err) {
//         dispatch({ type: requestFailAction });
//       }
//     };
//   };
// }

// function updatePhoneHandler(fieldName, requestStartAction, requestSuccessAction, requestFailAction, method = 'PUT') {
//   return fieldValue => {
//     return async dispatch => {
//       const options = {
//         body: JSON.stringify(fieldValue),
//         method,
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       };

//       dispatch({ type: requestStartAction });

//       try {
//         const response = await apiRequest('/profile/telephones', options);

//         recordProfileTransaction(kebabCase(`${fieldValue.phoneType} phone`));

//         // TODO: save transaction ID for status check
//         // TODO: check metadata for actionable info
//         console.log('transaction attributes', response.data.attributes);

//         // update profile info on FE side
//         dispatch({
//           type: UPDATE_VET360_PROFILE_FIELD,
//           fieldName,
//           newValue: fieldValue,
//         });
//       } catch (err) {
//         dispatch({ type: requestFailAction });
//       }
//     };
//   };
// }

const mockedTransactionStore = {
  create(fieldName) {
    return {
      type: VET360_TRANSACTION_BEGUN,
      fieldName,
      response: {
        data: {
          attributes: {
            transactionId: uniqueId('transaction_'),
            transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.RECEIVED,
            metadata: {
              isMocked: true
            }
          }
        }
      }
    };
  },
  update(transactionId) {
    return {
      data: {
        attributes: {
          transactionId,
          transactionStatus: VET360_CONSTANTS.TRANSACTION_STATUS.COMPLETED_FAILURE,
          metadata: {
            isMocked: true
          }
        }
      }
    };
  }
};

export function getTransactionStatus(transaction, fieldName) {
  return async dispatch => {
    const {
      data: {
        attributes: {
          transactionId,
          metadata: {
            isMocked
          }
        }
      }
    } = transaction;
    try {
      let response = null;
      if (isMocked) {
        response = mockedTransactionStore.update(transactionId);
      } else {
        response = await apiRequest(`/profile/status/${transactionId}`, options);
      }
      dispatch({
        type: VET360_TRANSACTION_UPDATE,
        response,
        fieldName
      });
    } catch (err) {
      // Hm...
    }
  };
}

function updateVet360Field(apiRoute, fieldName) {
  return fieldValue => {
    return async (dispatch, getState) => {
      dispatch({
        type: VET360_TRANSACTION_REQUESTED,
        fieldName
      });

      const currentValue = getState().user.profile.vet360[fieldName];
      const method = currentValue === null ? 'POST' : 'PUT';
      const options = {
        body: JSON.stringify(fieldValue),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      try {
        const response = await apiRequest(apiRoute, options);
        dispatch({
          type: VET360_TRANSACTION_BEGUN,
          fieldName,
          response
        });
      } catch (err) {
        dispatch(mockedTransactionStore.create(fieldName));
      }
    };
  };
}

export const saveField = {
  updateHomePhone: updateVet360Field('/profile/telephones', 'homePhone'),
  updateMobilePhone: updateVet360Field('/profile/telephones', 'mobilePhone'),
  updateWorkPhone: updateVet360Field('/profile/telephones', 'workPhone'),
  updateTemporaryPhone: updateVet360Field('/profile/telephones', 'temporaryPhone'),
  updateFaxNumber: updateVet360Field('/profile/telephones', 'faxNumber'),
  updateEmailAddress: updateVet360Field('/profile/email', 'email'),
  updateMailingAddress: updateVet360Field('/profile/mailing_address', 'mailingAddress')
};
