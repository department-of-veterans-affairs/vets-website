import formConfig from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import {
  SUBMIT_ID_FORM_STARTED,
  SUBMIT_ID_FORM_SUCCEEDED,
  SUBMIT_ID_FORM_FAILED,
} from './actions';

const initialState = {
  isLoading: false,
  error: null,
};

function hcaIDForm(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_ID_FORM_STARTED:
      return { ...state, isLoading: true };
    case SUBMIT_ID_FORM_SUCCEEDED:
      return { ...state, isLoading: false };
    case SUBMIT_ID_FORM_FAILED:
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaIDForm,
};
