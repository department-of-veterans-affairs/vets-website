import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  FSR_API_CALL_INITIATED,
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  FSR_ADDITIONAL_INCOME,
  FSR_DEDUCTIONS,
} from '../constants/actionTypes';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';

const initialState = {
  isError: false,
  errorCode: '',
  pending: true,
  debts: [],
  income: [],
  deductions: [],
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
        income: action.income,
      };
    }
    case FSR_DEDUCTIONS: {
      return {
        ...state,
        deductions: action.deductions,
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
