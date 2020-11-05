import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  FSR_API_CALL_INITIATED,
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
} from '../constants/actionTypes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';

const initialState = {
  isError: false,
  errorCode: '',
  pending: true,
  debts: [],
};

const fsrApi = (state = initialState, action) => {
  switch (action.type) {
    case FSR_API_ERROR:
      return {
        ...state,
        isError: true,
        errorCode: action.error,
        pending: false,
      };
    case FSR_RESET_ERRORS:
      return {
        ...initialState,
        pending: false,
      };
    case FSR_API_CALL_INITIATED:
      return {
        ...state,
        pending: true,
      };
    case DEBTS_FETCH_SUCCESS: {
      return {
        ...state,
        debts: action.debts,
      };
    }
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  fsr: fsrApi,
};
