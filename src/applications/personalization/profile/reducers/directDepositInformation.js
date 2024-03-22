import {
  DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED,
  DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED,
  DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED,
  DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED,
} from '@@profile/actions/directDepositInformation';

const initialState = {
  directDepositInformation: null,
  directDepositInformationUiState: {
    isEditing: false,
    isSaving: false,
    responseError: null,
  },
};

function directDepositInformation(state = initialState, action) {
  switch (action.type) {
    case DIRECT_DEPOSIT_INFORMATION_FETCH_SUCCEEDED:
    case DIRECT_DEPOSIT_INFORMATION_SAVE_SUCCEEDED: {
      return {
        ...state,
        directDepositInformation: action.response,
        directDepositInformationUiState: {
          responseError: null,
          isEditing: false,
          isSaving: false,
        },
      };
    }

    case DIRECT_DEPOSIT_INFORMATION_FETCH_FAILED: {
      return {
        ...state,
        directDepositInformation: { error: action.response.error || true },
      };
    }

    case DIRECT_DEPOSIT_INFORMATION_EDIT_TOGGLED: {
      return {
        ...state,
        directDepositInformationUiState: {
          ...state.directDepositInformationUiState,
          isEditing:
            action.open ?? !state.directDepositInformationUiState.isEditing,
          responseError: null,
        },
      };
    }

    case DIRECT_DEPOSIT_INFORMATION_SAVE_STARTED: {
      return {
        ...state,
        directDepositInformationUiState: {
          ...state.directDepositInformationUiState,
          responseError: null,
          isSaving: true,
        },
      };
    }

    case DIRECT_DEPOSIT_INFORMATION_SAVE_FAILED: {
      return {
        ...state,
        directDepositInformationUiState: {
          ...state.directDepositInformationUiState,
          isSaving: false,
          responseError: action.response,
        },
      };
    }

    default:
      return state;
  }
}

export default directDepositInformation;
