import cloneDeep from 'lodash/cloneDeep';

import {
  FIELD_NAMES,
  TRANSACTION_CATEGORY_TYPES,
  TRANSACTION_STATUS
} from '../constants/vet360';

export const defaultState = {
  user: {
    profile: {
      verified: true,
      status: 'OK',
      services: [

      ],
      vet360: {

      }
    }
  },

  vet360: {
    transactions: [],
    fieldTransactionMap: {

    }
  },

  vaProfile: {
    modal: null,
    formFields: {

    }
  }
};

export function resetState(state) {
  return cloneDeep(state, defaultState);
}
