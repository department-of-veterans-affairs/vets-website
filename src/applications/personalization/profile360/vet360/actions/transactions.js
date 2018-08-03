import { apiRequest } from '../../../../../platform/utilities/api';
import { refreshProfile } from '../../../../../platform/user/profile/actions';
import recordEvent from '../../../../../platform/monitoring/record-event';
import { pickBy } from 'lodash';

import localVet360, { isVet360Configured } from '../util/local-vet360';
import * as VET360_CONSTANTS from '../constants';
import { isSuccessfulTransaction, isFailedTransaction } from '../util/transactions';

export const VET360_TRANSACTIONS_FETCH_SUCCESS = 'VET360_TRANSACTIONS_FETCH_SUCCESS';
export const VET360_TRANSACTION_REQUESTED = 'VET360_TRANSACTION_REQUESTED';
export const VET360_TRANSACTION_REQUEST_FAILED = 'VET360_TRANSACTION_REQUEST_FAILED';
export const VET360_TRANSACTION_REQUEST_SUCCEEDED = 'VET360_TRANSACTION_REQUEST_SUCCEEDED';
export const VET360_TRANSACTION_REQUEST_CLEARED = 'VET360_TRANSACTION_REQUEST_CLEARED';
export const VET360_TRANSACTION_UPDATE_REQUESTED = 'VET360_TRANSACTION_UPDATE_REQUESTED';
export const VET360_TRANSACTION_UPDATED = 'VET360_TRANSACTION_UPDATED';
export const VET360_TRANSACTION_UPDATE_FAILED = 'VET360_TRANSACTION_UPDATE_FAILED';
export const VET360_TRANSACTION_CLEARED = 'VET360_TRANSACTION_CLEARED';

function recordProfileTransaction(event, fieldName) {
  const analyticsMap = VET360_CONSTANTS.ANALYTICS_FIELD_MAP;
  const mappedName = analyticsMap[fieldName];

  if (mappedName) {
    recordEvent({
      event,
      'profile-section': mappedName
    });
  }
}

export function initializeUserToVet360() {
  return async (dispatch) => {
    const method = 'POST';
    const fieldName = 'initialization';

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      dispatch({
        type: VET360_TRANSACTION_REQUESTED,
        fieldName,
        method
      });

      const transaction = isVet360Configured() ? await apiRequest('/profile/initialize_vet360_id/', options) : await localVet360.createTransaction();

      dispatch({
        type: VET360_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction
      });
    } catch (error) {
      dispatch({
        type: VET360_TRANSACTION_REQUEST_FAILED,
        error,
        fieldName
      });
    }
  };
}

export function fetchTransactions() {
  return async (dispatch) => {
    try {
      let response;
      if (isVet360Configured()) {
        response = await apiRequest('/profile/status/');
      } else {
        response = { data: [] };
        // Uncomment the line below to simulate transactions being processed during initialization
        // response = localVet360.getUserTransactions();
      }
      dispatch({
        type: VET360_TRANSACTIONS_FETCH_SUCCESS,
        data: response.data
      });
    } catch (err) {
      // If we sync transactions in the background and fail, is it worth telling the user?
    }
  };
}

export function clearTransaction(transaction) {
  return {
    type: VET360_TRANSACTION_CLEARED,
    transaction
  };
}

export function clearTransactionRequest(fieldName) {
  return {
    type: VET360_TRANSACTION_REQUEST_CLEARED,
    fieldName
  };
}

export function refreshTransaction(transaction, analyticsSectionName) {
  return async (dispatch, getState) => {
    try {
      const { transactionId } = transaction.data.attributes;
      const state = getState();
      const isAlreadyAwaitingUpdate = state.vet360.transactionsAwaitingUpdate.includes(transactionId);

      if (isAlreadyAwaitingUpdate) {
        return;
      }

      dispatch({
        type: VET360_TRANSACTION_UPDATE_REQUESTED,
        transaction
      });

      const transactionRefreshed = isVet360Configured() ? await apiRequest(`/profile/status/${transactionId}`) : await localVet360.updateTransaction(transactionId);

      if (isSuccessfulTransaction(transactionRefreshed)) {
        const forceCacheClear = true;
        await dispatch(refreshProfile(forceCacheClear));
        dispatch(clearTransaction(transactionRefreshed));

        if (analyticsSectionName) {
          recordEvent({ event: 'profile-saved' });
        }
      } else {
        dispatch({
          type: VET360_TRANSACTION_UPDATED,
          transaction: transactionRefreshed
        });

        if (isFailedTransaction(transactionRefreshed) && analyticsSectionName) {
          recordEvent({
            event: 'profile-edit-failure',
            'profile-action': 'save-failure',
            'profile-section': analyticsSectionName,
          });
        }
      }
    } catch (err) {
      dispatch({
        type: VET360_TRANSACTION_UPDATE_FAILED,
        transaction,
        err
      });
    }
  };
}

// TODO: reconcile this with data object cleaning in misc/form update reducer
// inputPhoneNumber is stripped here because it is only used for display in the form
function createPhoneObject(phoneFormData, fieldName) {
  // strip falsy values like '', null so vet360 does not reject
  return pickBy({
    id: phoneFormData.id,
    areaCode: phoneFormData.areaCode,
    countryCode: '1', // currently no international phone number support
    extension: phoneFormData.extension,
    phoneNumber: phoneFormData.phoneNumber,
    isInternational: false, // currently no international phone number support
    phoneType: VET360_CONSTANTS.PHONE_TYPE[fieldName],
  }, e => !!e);
}

function createAddressObject(addressFormData, fieldName) {
  return pickBy({
    id: addressFormData.id,
    addressLine1: addressFormData.addressLine1,
    addressLine2: addressFormData.addressLine2,
    addressLine3: addressFormData.addressLine3,
    addressType: addressFormData.addressType,
    city: addressFormData.city,
    countryName: addressFormData.countryName,
    stateCode: addressFormData.stateCode,
    internationalPostalCode: addressFormData.internationalPostalCode,
    zipCode: addressFormData.zipCode,
    province: addressFormData.province,
    addressPou: fieldName === 'mailingAddress' ? 'CORRESPONDENCE' : 'RESIDENCE/CHOICE',
  }, e => !!e);
}

function updateVet360Field(apiRoute, fieldName, fieldType) {
  return (nextFieldValue) => {
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
          fieldName,
          method
        });

        const transaction = isVet360Configured() ? await apiRequest(apiRoute, options) : await localVet360.createTransaction();

        recordProfileTransaction('profile-transaction', fieldName);

        dispatch({
          type: VET360_TRANSACTION_REQUEST_SUCCEEDED,
          fieldName,
          transaction
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

function deleteVet360Field(apiRoute, fieldName, fieldType) {
  return () => {
    return async (dispatch, getState) => {
      const currentState = getState();
      const currentFieldValue = currentState.user.profile.vet360[fieldName];
      let fieldData = currentFieldValue;

      switch (fieldType) {
        case 'phone':
          fieldData = createPhoneObject(currentFieldValue, fieldName);
          break;
        case 'email':
          break;
        case 'address':
          fieldData = createAddressObject(currentFieldValue, fieldName);
          break;
        default:
      }

      const options = {
        body: JSON.stringify(fieldData),
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      try {
        dispatch({
          type: VET360_TRANSACTION_REQUESTED,
          fieldName,
          method: 'DELETE'
        });

        const transaction = isVet360Configured() ? await apiRequest(apiRoute, options) : await localVet360.createTransaction();

        recordProfileTransaction('profile-deleted', fieldName);

        dispatch({
          type: VET360_TRANSACTION_REQUEST_SUCCEEDED,
          fieldName,
          transaction
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

export const fieldUpdaters = {
  [VET360_CONSTANTS.FIELD_NAMES.HOME_PHONE]: {
    update: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.HOME_PHONE, 'phone'),
    destroy: deleteVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.HOME_PHONE, 'phone')
  },

  [VET360_CONSTANTS.FIELD_NAMES.MOBILE_PHONE]: {
    update: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.MOBILE_PHONE, 'phone'),
    destroy: deleteVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.MOBILE_PHONE, 'phone')
  },

  [VET360_CONSTANTS.FIELD_NAMES.WORK_PHONE]: {
    update: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.WORK_PHONE, 'phone'),
    destroy: deleteVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.WORK_PHONE, 'phone')
  },

  [VET360_CONSTANTS.FIELD_NAMES.TEMP_PHONE]: {
    update: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.TEMP_PHONE, 'phone'),
    destroy: deleteVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.TEMP_PHONE, 'phone')
  },

  [VET360_CONSTANTS.FIELD_NAMES.FAX_NUMBER]: {
    update: updateVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.FAX_NUMBER, 'phone'),
    destroy: deleteVet360Field('/profile/telephones', VET360_CONSTANTS.FIELD_NAMES.FAX_NUMBER, 'phone')
  },

  [VET360_CONSTANTS.FIELD_NAMES.EMAIL]: {
    update: updateVet360Field('/profile/email_addresses', VET360_CONSTANTS.FIELD_NAMES.EMAIL, 'email'),
    destroy: deleteVet360Field('/profile/email_addresses', VET360_CONSTANTS.FIELD_NAMES.EMAIL, 'email')
  },

  [VET360_CONSTANTS.FIELD_NAMES.MAILING_ADDRESS]: {
    update: updateVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.MAILING_ADDRESS, 'address'),
    destroy: deleteVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.MAILING_ADDRESS, 'address')
  },

  [VET360_CONSTANTS.FIELD_NAMES.RESIDENTIAL_ADDRESS]: {
    update: updateVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.RESIDENTIAL_ADDRESS, 'address'),
    destroy: deleteVet360Field('/profile/addresses', VET360_CONSTANTS.FIELD_NAMES.RESIDENTIAL_ADDRESS, 'address')
  },
};
