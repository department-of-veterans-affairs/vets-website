import {
  // Fetch actions
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_ADDRESS_CONSTANTS_SUCCESS,

  // Vet360 Request Actions
  VET360_TRANSACTION_REQUESTED,
  VET360_TRANSACTION_REQUEST_SUCCEEDED,
  VET360_TRANSACTION_REQUEST_FAILED,
  VET360_TRANSACTION_UPDATED,
  VET360_TRANSACTION_FINISHED,

  // Miscellaneous actions
  UPDATE_PROFILE_FORM_FIELD,
  OPEN_MODAL,
  CLEAR_PROFILE_ERRORS,
  CLEAR_MESSAGE
} from '../actions';

const initialState = {
  hero: null,
  contactInformation: null,
  personalInformation: null,
  militaryInformation: null,
  addressConstants: null,
  modal: null,
  pendingSaves: [],
  formFields: {},
  message: null,
  transactions: {},
  errors: [] // @todo remove this - transactions hold error information now
};

const MESSAGES = {
  updatedInformation: 'We saved your updated information.'
};

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
        states: action.addressConstants.states.states,
        countries: action.addressConstants.countries.countries,
      };
      return { ...state, addressConstants: flattened };
    }

    // Vet360 Request Actions
    case VET360_TRANSACTION_REQUESTED: {
      const transactions = {
        ...state.transactions,
        [action.fieldName]: {
          isPending: true
        }
      };
      return { ...state, transactions, modal: null };
    }

    case VET360_TRANSACTION_REQUEST_FAILED: {
      const transactions = {
        ...state.transactions,
        [action.fieldName]: {
          isFailed: true,
          error: action.error
        }
      };
      return { ...state, transactions, modal: null };
    }

    case VET360_TRANSACTION_REQUEST_SUCCEEDED:
    case VET360_TRANSACTION_UPDATED: {
      const transactions = {
        ...state.transactions,
        [action.fieldName]: action.response
      };
      return { ...state, transactions };
    }

    case VET360_TRANSACTION_FINISHED: {
      const transactions = { ...state.transactions };
      delete transactions[action.fieldName];
      return { ...state, transactions, message: MESSAGES.updatedInformation };
    }

    // Miscellaneous
    case UPDATE_PROFILE_FORM_FIELD: {
      const formFields = { ...state.formFields, [action.field]: action.newState };
      return { ...state, formFields };
    }

    case OPEN_MODAL: {
      const modal = action.modal;
      let transactions = state.transactions;
      if (!modal) {
        transactions = state.transactions.filter(t => !t.isFailed);
      }
      return { ...state, transactions, modal };
    }

    case CLEAR_PROFILE_ERRORS: {
      const transactions = state.transactions.filter(t => !t.isFailed);
      return { ...state, transactions };
    }

    case CLEAR_MESSAGE:
      return { ...state, message: null };

    default:
      return state;
  }
}

export default { vaProfile };
