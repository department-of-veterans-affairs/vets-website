import {
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_SAVE_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
} from '@@profile/actions/directDeposit';

const initialState = {
  controlInformation: null,
  paymentAccount: null,
  error: null,
  ui: {
    isEditing: false,
    isSaving: false,
  },
};

function directDeposit(state = initialState, action) {
  switch (action.type) {
    case DIRECT_DEPOSIT_FETCH_SUCCEEDED:
    case DIRECT_DEPOSIT_SAVE_SUCCEEDED: {
      return {
        controlInformation: action.response?.controlInformation,
        paymentAccount: action.response?.paymentAccount,
        error: null,
        ui: {
          isEditing: false,
          isSaving: false,
        },
      };
    }

    case DIRECT_DEPOSIT_FETCH_FAILED: {
      return {
        ...state,
        error: action.response.error || true,
      };
    }

    case DIRECT_DEPOSIT_EDIT_TOGGLED: {
      return {
        ...state,
        error: null,
        ui: {
          ...state.ui,
          isEditing: action.open ?? !state.ui.isEditing,
        },
      };
    }

    case DIRECT_DEPOSIT_SAVE_STARTED: {
      return {
        ...state,
        ui: {
          ...state.ui,
          responseError: null,
          isSaving: true,
        },
      };
    }

    case DIRECT_DEPOSIT_SAVE_FAILED: {
      return {
        ...state,
        error: action.response,
        ui: {
          ...state.ui,
          isSaving: false,
        },
      };
    }

    default:
      return state;
  }
}

export default directDeposit;
