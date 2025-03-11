import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  VERIFY_VA_FILE_NUMBER_SUCCEEDED,
  VERIFY_VA_FILE_NUMBER_STARTED,
  VERIFY_VA_FILE_NUMBER_FAILED,
} from '../actions';

const initialState = {
  hasVaFileNumber: {},
  isLoading: false,
};

const vaFileNumber = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_VA_FILE_NUMBER_STARTED:
      return {
        isLoading: true,
        hasVaFileNumber: {},
      };
    case VERIFY_VA_FILE_NUMBER_SUCCEEDED:
    case VERIFY_VA_FILE_NUMBER_FAILED:
      return {
        hasVaFileNumber: action.response,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default {
  vaFileNumber,
  form: createSaveInProgressFormReducer(formConfig),
};
