import set from 'platform/utilities/data/set';

import { PERSONAL_INFO_FIELD_NAMES } from '@@vap-svc/constants';

import { capitalize } from 'lodash';
import {
  UPDATE_PERSONAL_INFORMATION_FIELD,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_PERSONAL_INFORMATION_FAILED,
} from '@@vap-svc/actions/personalInformation';
import {
  FETCH_HERO_SUCCESS,
  FETCH_HERO_FAILED,
  FETCH_MILITARY_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_FAILED,
} from '../actions';

import {
  CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
  CNP_PAYMENT_INFORMATION_FETCH_FAILED,
  CNP_PAYMENT_INFORMATION_SAVE_STARTED,
  CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
  CNP_PAYMENT_INFORMATION_SAVE_FAILED,
  CNP_PAYMENT_INFORMATION_EDIT_TOGGLED,
  EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED,
  EDU_PAYMENT_INFORMATION_FETCH_FAILED,
  EDU_PAYMENT_INFORMATION_SAVE_STARTED,
  EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED,
  EDU_PAYMENT_INFORMATION_SAVE_FAILED,
  EDU_PAYMENT_INFORMATION_EDIT_TOGGLED,
} from '../actions/paymentInformation';

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
  cnpPaymentInformation: null,
  eduPaymentInformation: null,
  cnpPaymentInformationUiState: {
    isEditing: false,
    isSaving: false,
    responseError: null,
  },
  eduPaymentInformationUiState: {
    isEditing: false,
    isSaving: false,
    responseError: null,
  },
};

function vaProfile(state = initialState, action) {
  switch (action.type) {
    case FETCH_HERO_SUCCESS:
    case FETCH_HERO_FAILED:
      return set('hero', action.hero, state);

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
    case FETCH_PERSONAL_INFORMATION_FAILED:
      return set('personalInformation', action.personalInformation, state);

    case UPDATE_PERSONAL_INFORMATION_FIELD: {
      let fieldValue;
      switch (action.fieldName) {
        case PERSONAL_INFO_FIELD_NAMES.PREFERRED_NAME: {
          fieldValue = capitalize(action.value[action.fieldName]);
          break;
        }
        case PERSONAL_INFO_FIELD_NAMES.GENDER_IDENTITY: {
          fieldValue = { code: action.value[action.fieldName] };
          break;
        }
        default:
          fieldValue = action.value[action.fieldName];
          break;
      }

      return set(`personalInformation.${action.fieldName}`, fieldValue, state);
    }

    case FETCH_MILITARY_INFORMATION_SUCCESS:
    case FETCH_MILITARY_INFORMATION_FAILED:
      return set('militaryInformation', action.militaryInformation, state);

    case CNP_PAYMENT_INFORMATION_FETCH_SUCCEEDED:
    case CNP_PAYMENT_INFORMATION_SAVE_SUCCEEDED: {
      let newState = set('cnpPaymentInformation', action.response, state);
      newState = set('cnpPaymentInformationUiState.isEditing', false, newState);
      return set('cnpPaymentInformationUiState.isSaving', false, newState);
    }

    case CNP_PAYMENT_INFORMATION_EDIT_TOGGLED: {
      const newState = set(
        'cnpPaymentInformationUiState.isEditing',
        action.open ?? !state.cnpPaymentInformationUiState.isEditing,
        state,
      );

      return set('cnpPaymentInformationUiState.responseError', null, newState);
    }

    case CNP_PAYMENT_INFORMATION_SAVE_STARTED: {
      const cnpPaymentInformationUiState = {
        ...state.cnpPaymentInformationUiState,
        responseError: null,
        isSaving: true,
      };
      return { ...state, cnpPaymentInformationUiState };
    }

    case CNP_PAYMENT_INFORMATION_FETCH_FAILED: {
      return set(
        'cnpPaymentInformation',
        { error: action.response.error || true },
        state,
      );
    }

    case CNP_PAYMENT_INFORMATION_SAVE_FAILED: {
      const newState = set(
        'cnpPaymentInformationUiState.isSaving',
        false,
        state,
      );
      return set(
        'cnpPaymentInformationUiState.responseError',
        action.response,
        newState,
      );
    }

    case EDU_PAYMENT_INFORMATION_SAVE_SUCCEEDED:
    case EDU_PAYMENT_INFORMATION_FETCH_SUCCEEDED: {
      let newState = set('eduPaymentInformation', action.response, state);
      newState = set('eduPaymentInformationUiState.isEditing', false, newState);
      return set('eduPaymentInformationUiState.isSaving', false, newState);
    }

    case EDU_PAYMENT_INFORMATION_EDIT_TOGGLED: {
      const newState = set(
        'eduPaymentInformationUiState.isEditing',
        action.open ?? !state.eduPaymentInformationUiState.isEditing,
        state,
      );

      return set('eduPaymentInformationUiState.responseError', null, newState);
    }

    case EDU_PAYMENT_INFORMATION_SAVE_STARTED: {
      const eduPaymentInformationUiState = {
        ...state.eduPaymentInformationUiState,
        responseError: null,
        isSaving: true,
      };
      return { ...state, eduPaymentInformationUiState };
    }

    case EDU_PAYMENT_INFORMATION_FETCH_FAILED: {
      return set(
        'eduPaymentInformation',
        { error: action.response.error || true },
        state,
      );
    }

    case EDU_PAYMENT_INFORMATION_SAVE_FAILED: {
      const newState = set(
        'eduPaymentInformationUiState.isSaving',
        false,
        state,
      );
      return set(
        'eduPaymentInformationUiState.responseError',
        action.response,
        newState,
      );
    }

    default:
      return state;
  }
}

export default vaProfile;
