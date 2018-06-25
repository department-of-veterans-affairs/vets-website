import { apiRequest } from '../../../../platform/utilities/api';
import { refreshProfile } from '../../../../platform/user/profile/actions';
import recordEvent from '../../../../platform/monitoring/record-event';
import { pickBy } from 'lodash';

import localVet360, { isVet360Configured } from '../util/local-vet360';
import * as VET360_CONSTANTS from '../constants/vet360';
import { isSuccessfulTransaction } from '../util/transactions';

// @todo get rid of this now that it uses refreshProfile
export const UPDATE_VET360_PROFILE_FIELD = 'UPDATE_VET360_PROFILE_FIELD';

export const VET360_TRANSACTION_REQUESTED = 'VET360_TRANSACTION_REQUESTED';
export const VET360_TRANSACTION_REQUEST_FAILED = 'VET360_TRANSACTION_REQUEST_FAILED';
export const VET360_TRANSACTION_REQUEST_SUCCEEDED = 'VET360_TRANSACTION_REQUEST_SUCCEEDED';
export const VET360_TRANSACTION_REQUEST_CLEARED = 'VET360_TRANSACTION_REQUEST_CLEARED';
export const VET360_TRANSACTION_UPDATED = 'VET360_TRANSACTION_UPDATED';
export const VET360_TRANSACTION_CLEARED = 'VET360_TRANSACTION_CLEARED';

function recordProfileTransaction(fieldName) {
  const analyticsMap = {
    homePhone: 'home-telephone',
    mobilePhone: 'mobile-telephone',
    workPhone: 'work-telephone',
    mailingAddress: 'mailing-address',
    residentialAddress: 'home-address',
    faxNumber: 'fax-telephone',
    email: 'email',
  };

  if (analyticsMap[fieldName]) {
    recordEvent({
      event: 'profile-transaction',
      'profile-section': fieldName
    });
  }
}

export function refreshTransaction(transaction) {
  return async (dispatch) => {
    try {
      const { transactionId } = transaction.data.attributes;
      const transactionRefreshed = isVet360Configured() ? await apiRequest(`/profile/status/${transactionId}`) : localVet360.updateTransactionRandom(transactionId);

      dispatch({
        type: VET360_TRANSACTION_UPDATED,
        transaction: transactionRefreshed
      });

      if (isSuccessfulTransaction(transactionRefreshed)) {
        await dispatch(refreshProfile());
      }
    } catch (err) {
      // Just allow the former transaction status to remain in the store in the event of an error.
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
          fieldName
        });

        const transaction = isVet360Configured() ? await apiRequest(apiRoute, options) : await localVet360.createTransaction();

        recordProfileTransaction(fieldName);

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
          fieldName
        });

        const transaction = isVet360Configured() ? await apiRequest(apiRoute, options) : await localVet360.createTransaction();

        // TODO turn analytics back on later
        // if (apiRoute === '/profile/telephones') {
        //   recordProfileTransaction(kebabCase(`${nextFieldValue.phoneType} phone`));
        // }

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
  }
};
