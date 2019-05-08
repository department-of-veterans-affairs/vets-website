import vet360 from '../vet360/reducers';

import {
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
} from '../actions';

import {
  FETCH_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION,
  SAVE_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION_FAIL,
  SET_PAYMENT_INFO_UI_STATE,
} from '../actions/paymentInformation';

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
  paymentInformation: null,
  paymentInformationUiState: {
    isEditing: false,
    isSaving: false,
  },
};

function vaProfile(state = initialState, action) {
  switch (action.type) {
    case FETCH_HERO_SUCCESS:
      return { ...state, hero: action.hero };

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
      return { ...state, personalInformation: action.personalInformation };

    case FETCH_MILITARY_INFORMATION_SUCCESS:
      return { ...state, militaryInformation: action.militaryInformation };

    case FETCH_PAYMENT_INFORMATION_SUCCESS:
    case SAVE_PAYMENT_INFORMATION_SUCCESS:
      return {
        ...state,
        paymentInformation: action.paymentInformation,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          response: null,
          isSaving: false,
          isEditing: false,
        },
      };

    case SAVE_PAYMENT_INFORMATION:
      return {
        ...state,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          response: null,
          isSaving: true,
          isEditing: true,
        },
      };

    case SAVE_PAYMENT_INFORMATION_FAIL:
      return {
        ...state,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          response: action.response,
          isSaving: false,
          isEditing: true,
        },
      };

    case SET_PAYMENT_INFO_UI_STATE:
      return {
        ...state,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          ...action.state,
        },
      };

    default:
      return state;
  }
}

export default {
  vaProfile,
  vet360,
};
