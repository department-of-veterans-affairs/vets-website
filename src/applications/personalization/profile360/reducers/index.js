import set from 'platform/utilities/data/set';
import vet360 from 'vet360/reducers';
import { hcaEnrollmentStatus } from 'applications/hca/reducer';

import {
  FETCH_HERO_SUCCESS,
  FETCH_PERSONAL_INFORMATION_SUCCESS,
  FETCH_MILITARY_INFORMATION_SUCCESS,
} from '../actions';

import {
  PAYMENT_INFORMATION_FETCH_SUCCEEDED,
  PAYMENT_INFORMATION_FETCH_FAILED,
  PAYMENT_INFORMATION_SAVE_STARTED,
  PAYMENT_INFORMATION_SAVE_SUCCEEDED,
  PAYMENT_INFORMATION_SAVE_FAILED,
  PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED,
  PAYMENT_INFORMATION_EDIT_MODAL_FIELD_CHANGED,
} from '../actions/paymentInformation';

const editModalFormsInitialState = {
  financialInstitutionRoutingNumber: {
    errorMessage: undefined,
    field: {
      value: '',
      dirty: false,
    },
  },
  accountNumber: {
    errorMessage: undefined,
    field: {
      value: '',
      dirty: false,
    },
  },
  accountType: {
    errorMessage: undefined,
    value: {
      value: '',
      dirty: false,
    },
  },
};

const initialState = {
  hero: null,
  personalInformation: null,
  militaryInformation: null,
  paymentInformation: null,
  paymentInformationUiState: {
    isEditing: false,
    isSaving: false,
    responseError: null,
    editModalForm: editModalFormsInitialState,
  },
};

function vaProfile(state = initialState, action) {
  switch (action.type) {
    case FETCH_HERO_SUCCESS:
      return set('hero', action.hero, state);

    case FETCH_PERSONAL_INFORMATION_SUCCESS:
      return set('personalInformation', action.personalInformation, state);

    case FETCH_MILITARY_INFORMATION_SUCCESS:
      return set('militaryInformation', action.militaryInformation, state);

    case PAYMENT_INFORMATION_FETCH_SUCCEEDED:
    case PAYMENT_INFORMATION_SAVE_SUCCEEDED: {
      let newState = set('paymentInformation', action.response, state);
      newState = set('paymentInformationUiState.isEditing', false, newState);
      return set('paymentInformationUiState.isSaving', false, newState);
    }

    case PAYMENT_INFORMATION_EDIT_MODAL_TOGGLED: {
      let newState = set(
        'paymentInformationUiState.isEditing',
        !state.paymentInformationUiState.isEditing,
        state,
      );

      newState = set('paymentInformationUiState.responseError', null, newState);

      return set(
        'paymentInformationUiState.editModalForm',
        editModalFormsInitialState,
        newState,
      );
    }

    case PAYMENT_INFORMATION_EDIT_MODAL_FIELD_CHANGED:
      return set(
        `paymentInformationUiState.editModalForm.${action.fieldName}`,
        action.fieldValue,
        state,
      );

    case PAYMENT_INFORMATION_SAVE_STARTED:
      return set('paymentInformationUiState.isSaving', true, state);

    case PAYMENT_INFORMATION_FETCH_FAILED: {
      return set(
        'paymentInformation',
        { error: action.response.error || true },
        state,
      );
    }

    case PAYMENT_INFORMATION_SAVE_FAILED: {
      const newState = set('paymentInformationUiState.isSaving', false, state);
      return set(
        'paymentInformationUiState.responseError',
        action.response,
        newState,
      );
    }

    default:
      return state;
  }
}

export default {
  vaProfile,
  vet360,
  hcaEnrollmentStatus,
};
