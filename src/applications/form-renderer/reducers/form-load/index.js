import {
  FORM_LOADING_INITIATED,
  FORM_LOADING_SUCCEEDED,
  FORM_LOADING_FAILED,
} from '../../actions/form-load';

export const initialState = {
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
          isError: false,
          isSuccess: false,
          formId: action.formId,
          formConfig: null,
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
          isError: true,
          isSuccess: false,
          error: action.error,
          formConfig: null,
        };

      default:
        return state;
    }
  },
};
