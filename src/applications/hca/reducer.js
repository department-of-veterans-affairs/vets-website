import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import {
  SUBMIT_ID_FORM_STARTED,
  SUBMIT_ID_FORM_SUCCEEDED,
  SUBMIT_ID_FORM_FAILED,
} from './actions';

const initialState = {
  enrollmentStatus: null,
  hasServerError: false,
  isSubmitting: false,
  isUserInMVI: false,
  loginRequired: false,
  noESRRecordFound: false,
};

function hcaIDForm(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_ID_FORM_STARTED:
      return { ...initialState, isSubmitting: true };

    case SUBMIT_ID_FORM_SUCCEEDED: {
      const { parsedStatus: enrollmentStatus } = action.data;
      const isInESR = enrollmentStatus !== 'none_of_the_above';
      return {
        ...state,
        enrollmentStatus,
        loginRequired: isInESR,
        isSubmitting: false,
        isUserInMVI: true,
      };
    }

    case SUBMIT_ID_FORM_FAILED: {
      const { errors } = action;
      const noESRRecordFound =
        errors && errors.some(error => error.code === '404');
      const hasServerError = errors && errors.some(error => error.code >= 500);
      const hasRateLimitError =
        errors && errors.some(error => error.code === '429');
      return {
        ...state,
        hasServerError,
        isSubmitting: false,
        loginRequired: hasRateLimitError,
        noESRRecordFound,
      };
    }

    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaIDForm,
};
