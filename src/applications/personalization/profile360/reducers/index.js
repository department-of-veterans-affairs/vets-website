import vet360 from '../vet360/reducers';

import {
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
} from '../actions';

import {
  PAYMENT_INFORMATION_FETCH_SUCCEEDED,
  PAYMENT_INFORMATION_SAVE_STARTED,
  PAYMENT_INFORMATION_SAVE_SUCCEEDED,
  PAYMENT_INFORMATION_SAVE_FAILED,
  PAYMENT_INFO_UI_STATE_CHANGED,
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

    case PAYMENT_INFORMATION_FETCH_SUCCEEDED:
    case PAYMENT_INFORMATION_SAVE_SUCCEEDED:
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

    case PAYMENT_INFORMATION_SAVE_STARTED:
      return {
        ...state,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          response: null,
          isSaving: true,
          isEditing: true,
        },
      };

    case PAYMENT_INFORMATION_SAVE_FAILED:
      return {
        ...state,
        paymentInformationUiState: {
          ...state.paymentInformationUiState,
          response: action.response,
          isSaving: false,
          isEditing: true,
        },
      };

    case PAYMENT_INFO_UI_STATE_CHANGED:
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
