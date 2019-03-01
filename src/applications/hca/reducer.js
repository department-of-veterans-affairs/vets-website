import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import {
  SUBMIT_ID_FORM_STARTED,
  SUBMIT_ID_FORM_SUCCEEDED,
  SUBMIT_ID_FORM_FAILED,
} from './actions';

const initialState = {
  hasOptionalDD214Upload: false,
  isSubmitting: false,
  errors: null,
  enrollmentStatus: null,
};

function hcaIDForm(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_ID_FORM_STARTED:
      return { ...state, isSubmitting: true };

    case SUBMIT_ID_FORM_SUCCEEDED: {
      const { parsedStatus: enrollmentStatus } = action.data;
      return { ...state, isSubmitting: false, enrollmentStatus };
    }

    case SUBMIT_ID_FORM_FAILED: {
      const { errors } = action;
      const hasOptionalDD214Upload = errors.some(error => error.code === '404');
      return { ...state, errors, hasOptionalDD214Upload, isSubmitting: false };
    }

    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaIDForm,
};
