import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import {
  SUBMIT_ID_FORM_STARTED,
  SUBMIT_ID_FORM_SUCCEEDED,
  SUBMIT_ID_FORM_FAILED,
} from './actions';

const initialState = {
  noESRRecordFound: false,
  isUserInMVI: false,
  isSubmitting: false,
  errors: null,
  enrollmentStatus: null,
};

function hcaIDForm(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_ID_FORM_STARTED:
      return { ...state, isSubmitting: true, errors: null };

    case SUBMIT_ID_FORM_SUCCEEDED: {
      const { parsedStatus: enrollmentStatus } = action.data;
      return {
        ...state,
        isSubmitting: false,
        isUserInMVI: true,
        enrollmentStatus,
      };
    }

    case SUBMIT_ID_FORM_FAILED: {
      const { errors } = action;
      const noESRRecordFound =
        errors && errors.some(error => error.code === '404');
      return { ...state, errors, noESRRecordFound, isSubmitting: false };
    }

    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaIDForm,
};
