import vet360 from '../vet360/reducers';

import {
  // Fetch actions
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_ADDRESS_CONSTANTS_SUCCESS,

  // Miscellaneous actions
  VET360_TRANSACTION_REQUEST_SUCCEEDED,
  UPDATE_PROFILE_FORM_FIELD,
  OPEN_MODAL
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

    default:
      return state;
  }
}

export default {
  vaProfile,
  vet360
};
