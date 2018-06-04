import {
  // Fetch actions
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_ADDRESS_CONSTANTS_SUCCESS,

  VET360_TRANSACTION_REQUESTED,
  VET360_TRANSACTION_BEGUN,
  VET360_TRANSACTION_UPDATE,
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
  errors: [],
  profileLoading: true,
  loading: true,
  formFields: {},
  message: null,
  transactions: {}
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

    case VET360_TRANSACTION_REQUESTED:
    case VET360_TRANSACTION_BEGUN:
    case VET360_TRANSACTION_UPDATE:
    case VET360_TRANSACTION_FINISHED: {
      const transactions = { ...state.transactions };
      transactions[action.fieldName] = action.response || null;
      console.log(action.fieldName, transactions[action.fieldName]);
      return { ...state, transactions, modal: null };
    }

    // Miscellaneous
    case UPDATE_PROFILE_FORM_FIELD: {
      const formFields = { ...state.formFields, [action.field]: action.newState };
      return { ...state, formFields };
    }

    case OPEN_MODAL: {
      const modal = action.modal;
      const errors = modal ? state.errors : [];
      return { ...state, errors, modal };
    }

    case CLEAR_PROFILE_ERRORS:
      return { ...state, errors: [] };

    case CLEAR_MESSAGE:
      return { ...state, message: null };

    default:
      return state;
  }
}

export default { vaProfile };
