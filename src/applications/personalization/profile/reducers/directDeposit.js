import {
  DIRECT_DEPOSIT_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_FETCH_FAILED,
  DIRECT_DEPOSIT_SAVE_STARTED,
  DIRECT_DEPOSIT_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_SAVE_FAILED,
  DIRECT_DEPOSIT_EDIT_TOGGLED,
  DIRECT_DEPOSIT_LOAD_ERROR_CLEARED,
  DIRECT_DEPOSIT_SAVE_ERROR_CLEARED,
} from '@@profile/actions/directDeposit';

const initialState = {
  controlInformation: null,
  paymentAccount: null,
  loadError: null,
  saveError: null,
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
        controlInformation: action.response?.controlInformation ?? null,
        paymentAccount: action.response?.paymentAccount ?? null,
        loadError: null,
        saveError: null,
        ui: {
          isEditing: false,
          isSaving: false,
        },
      };
    }

    case DIRECT_DEPOSIT_FETCH_FAILED: {
      return {
        ...state,
        loadError: action.response?.error ?? true,
        saveError: null,
      };
    }

    case DIRECT_DEPOSIT_EDIT_TOGGLED: {
      return {
        ...state,
        saveError: null,
        ui: {
          ...state.ui,
          isEditing: action.open ?? !state.ui.isEditing,
        },
      };
    }

    case DIRECT_DEPOSIT_LOAD_ERROR_CLEARED: {
      return {
        ...state,
        saveError: null,
      };
    }

    case DIRECT_DEPOSIT_SAVE_ERROR_CLEARED: {
      return {
        ...state,
        loadError: null,
      };
    }

    case DIRECT_DEPOSIT_SAVE_STARTED: {
      return {
        ...state,
        saveError: null,
        ui: {
          ...state.ui,
          isSaving: true,
        },
      };
    }

    case DIRECT_DEPOSIT_SAVE_FAILED: {
      return {
        ...state,
        saveError: action.response?.error ?? action.response?.errors ?? true,
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
