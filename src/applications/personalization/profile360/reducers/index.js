import vet360 from './vet360';

import {
  // Fetch actions
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_ADDRESS_CONSTANTS_SUCCESS,

  // Miscellaneous actions
  VET360_TRANSACTION_REQUEST_SUCCEEDED,
  UPDATE_PROFILE_FORM_FIELD,
  OPEN_MODAL,
  CLEAR_MESSAGE
} from '../actions';

const initialState = {
  hero: null,
  contactInformation: null,
  personalInformation: null,
  militaryInformation: null,
  addressConstants: null,
  modal: null,
  formFields: {},
  message: null,
  transactions: {}
};

// @todo
// Should transaction information be used to populate an array of generic messages? ----------

// Option 1,
// When VET360_TRANSACTION_UPDATED comes down the pipe, check if completed/errored and generate
// messages based on that. Closing the message just removes that message from state and the transaction hangs around just in case.
// But do we even need that transaction anymore?

// Option 2.
// Don't change the reducers. The error/success messaging should reflect the transactions directly, and closing
// the messages should directly remove the transaction from state.
// We would lose all reference to that transaction - is that okay?

// Leaning towards Option 2.
// When the message renders, it is always because the transaction is in a finished state, whether successful or errored.
// Once cleared it makes sense to also give up our reference to the transaction.
// This way we can also check for the transaction request information and clear it from there too if it exists.
// If we do this, we can simplify the getTransactionStatus message because the component itself will check for the completed state
// of the transaction and decide whether it's successful or errored.
// Once the user closes the messaging, we can dispatch an action to remove the transaction.

function vaProfile(state = initialState, action) {
  switch (action.type) {

    // Fetch
    case FETCH_HERO_SUCCESS:
      return { ...state, hero: action.hero };

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
      return { ...state, personalInformation: action.personalInformation };

    case FETCH_MILITARY_INFORMATION_SUCCESS:
      return { ...state, militaryInformation: action.militaryInformation };

    case FETCH_ADDRESS_CONSTANTS_SUCCESS: {
      const flattened = {
        states: action.addressConstants.states,
        countries: action.addressConstants.countries,
      };
      return { ...state, addressConstants: flattened };
    }

    // Miscellaneous
    case UPDATE_PROFILE_FORM_FIELD: {
      const formFields = { ...state.formFields, [action.field]: action.newState };
      return { ...state, formFields };
    }

    case OPEN_MODAL:
      return { ...state, modal: action.modal };

    case VET360_TRANSACTION_REQUEST_SUCCEEDED:
      return { ...state, modal: null };

    case CLEAR_MESSAGE:
      return { ...state, message: null };

    default:
      return state;
  }
}

export default {
  vaProfile,
  vet360
};
