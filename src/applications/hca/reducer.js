import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import {
  SUBMIT_ID_FORM_STARTED,
  SUBMIT_ID_FORM_SUCCEEDED,
  SUBMIT_ID_FORM_FAILED,
} from './actions';

const initialState = {
  isSubmitting: false,
  error: null,
  shouldHideIDForm: false,
};

function hcaIDForm(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_ID_FORM_STARTED:
      return { ...state, isSubmitting: true };
    case SUBMIT_ID_FORM_SUCCEEDED:
      return { ...state, isSubmitting: false };
    case SUBMIT_ID_FORM_FAILED:
      return { ...state, isSubmitting: false, error: action.error };
    case UPDATE_LOGGEDIN_STATUS:
      return { ...state, shouldHideIDForm: action.value };
    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaIDForm,
};
