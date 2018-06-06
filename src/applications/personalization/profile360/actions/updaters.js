import { apiRequest } from '../../../../platform/utilities/api';
// import recordEvent from '../../../../platform/monitoring/record-event';
// import { kebabCase } from 'lodash';

import localVet360, { isVet360Configured } from '../util/local-vet360';
import * as VET360_CONSTANTS from '../constants/vet360';

export const UPDATE_VET360_PROFILE_FIELD = 'UPDATE_VET360_PROFILE_FIELD';

export const VET360_TRANSACTION_REQUESTED = 'VET360_TRANSACTION_REQUESTED';
export const VET360_TRANSACTION_REQUEST_FAILED = 'VET360_TRANSACTION_REQUEST_FAILED';
export const VET360_TRANSACTION_REQUEST_SUCCEEDED = 'VET360_TRANSACTION_REQUEST_SUCCEEDED';
export const VET360_TRANSACTION_UPDATED = 'VET360_TRANSACTION_UPDATED';
export const VET360_TRANSACTION_FINISHED = 'VET360_TRANSACTION_FINISHED';

// function recordProfileTransaction(fieldName) {
//   const names = [
//     'mobile-phone',
//     'primary-telephone',
//     'mailing-address',
//   ];
//
//   if (names.includes(fieldName)) {
//     recordEvent({
//       event: 'profile-transaction',
//       'profile-section': fieldName
//     });
//   }
// }

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

function createPhoneObject(phoneFormData, fieldName) {
  const strippedPhone = phoneFormData.phoneNumber.replace(/[^\d]/g, '');
  const strippedExtension = phoneFormData.extension.replace(/[^a-zA-Z0-9]/g, '');
  return {
    ...phoneFormData,
    extension: strippedExtension === '' ? null : phoneFormData.extension,
    phoneNumber: strippedPhone.substring(3),
    areaCode: strippedPhone.substring(0, 3),
    phoneType: VET360_CONSTANTS.PHONE_TYPE[fieldName],
  };
}

function createAddressObject(addressFormData, fieldName) {
  return {
    ...addressFormData,
    addressPou: fieldName === 'mailingAddress' ? 'CORRESPONDENCE' : 'RESIDENCE/CHOICE',
  };
}

function updateVet360Field(apiRoute, fieldName, fieldType) {
  return nextFieldValue => {
    return async (dispatch, getState) => {
      const currentState = getState();
      const currentFieldValue = currentState.user.profile.vet360[fieldName];
      const method = currentFieldValue ? 'PUT' : 'POST';

      let fieldData = nextFieldValue;

      switch (fieldType) {
        case 'phone':
          fieldData = createPhoneObject(nextFieldValue, fieldName);
          break;
        case 'email':
          break;
        case 'address':
          fieldData = createAddressObject(nextFieldValue, fieldName);
          break;
        default:
      }

      const options = {
        body: JSON.stringify(fieldData),
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

        // TODO turn analytics back on later
        // if (apiRoute === '/profile/telephones') {
        //   recordProfileTransaction(kebabCase(`${nextFieldValue.phoneType} phone`));
        // }

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
  updateHomePhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.HOME_PHONE, 'phone'),
  updateMobilePhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.MOBILE_PHONE, 'phone'),
  updateWorkPhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.WORK_PHONE, 'phone'),
  updateTemporaryPhone: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.TEMP_PHONE, 'phone'),
  updateFaxNumber: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.FAX_NUMBER, 'phone'),
  updateEmailAddress: updateVet360Field('/profile/email_addresses', VET360_CONSTANTS.FIELD_NAMES.EMAIL, 'email'),
  updateMailingAddress: updateVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.MAILING_ADDRESS, 'address'),
  updateResidentialAddress: updateVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.RESIDENTIAL_ADDRESS, 'address')
};
