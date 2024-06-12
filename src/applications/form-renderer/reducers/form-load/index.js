import {
  FORM_LOADING_INITIATED,
  FORM_LOADING_SUCCEEDED,
  FORM_LOADING_FAILED,
} from '../../actions/form-load';

const initialState = {
  formId: null,
  formConfig: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  error: null,
};

export default {
  formLoad: (state = initialState, action) => {
    switch (action.type) {
      case FORM_LOADING_INITIATED:
        return {
          ...state,
          isLoading: true,
          formId: action.formId,
        };

      case FORM_LOADING_SUCCEEDED:
        return {
          ...state,
          isLoading: false,
          isError: false,
          isSuccess: true,
          error: null,
          formConfig: action.formConfig,
        };

      case FORM_LOADING_FAILED:
        return {
          ...state,
          isLoading: false,
          isSuccess: false,
          isError: true,
          error: action.error,
        };

      default:
        return state;
    }
  },
};
