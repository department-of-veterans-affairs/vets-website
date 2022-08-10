import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  FSR_API_CALL_INITIATED,
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
} from '../constants/actionTypes';
import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
} from '../actions/copays';
import { DEBTS_FETCH_SUCCESS } from '../../debt-letters/actions';

const initialState = {
  isError: false,
  errorCode: {},
  pending: true,
  pendingCopays: true,
  debts: [],
  statements: [],
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
    case DEBTS_FETCH_SUCCESS:
      return {
        ...state,
        debts: action.debts,
        pending: false,
      };
    case MCP_STATEMENTS_FETCH_SUCCESS:
      return {
        ...state,
        statements: action.statements,
        pendingCopays: false,
      };
    case MCP_STATEMENTS_FETCH_INIT:
      return {
        ...state,
        pendingCopays: true,
      };
    case MCP_STATEMENTS_FETCH_FAILURE:
      return {
        ...state,
        statements: action.statements,
        pendingCopays: false,
        copayError: action.copayError,
      };
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  fsr: fsrApi,
};
