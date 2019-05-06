import vet360 from '../vet360/reducers';

import {
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION,
  SAVE_PAYMENT_INFORMATION_SUCCESS,
  SAVE_PAYMENT_INFORMATION_FAIL,
} from '../actions';

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
  paymentInformation: null,
  paymentInformationStatus: {
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
        paymentInformationStatus: {
          response: null,
          isSaving: false,
        },
      };

    case SAVE_PAYMENT_INFORMATION:
      return {
        ...state,
        paymentInformationStatus: {
          response: null,
          isSaving: true,
        },
      };

    case SAVE_PAYMENT_INFORMATION_FAIL:
      return {
        ...state,
        paymentInformationStatus: {
          response: action.response,
          isSaving: false,
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
