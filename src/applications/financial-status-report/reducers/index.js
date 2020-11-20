import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  FSR_API_CALL_INITIATED,
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_ADDITIONAL_INCOME,
  FSR_EMPLOYMENT_HISTORY,
} from '../constants/actionTypes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';

const initialState = {
  isError: false,
  errorCode: '',
  pending: true,
  debts: [],
  additionalIncome: [],
  employmentHistory: [],
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
    case FSR_ADDITIONAL_INCOME: {
      return {
        ...state,
        additionalIncome: action.additionalIncome,
      };
    }
    case FSR_EMPLOYMENT_HISTORY: {
      return {
        ...state,
        employmentHistory: action.employmentHistory,
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
