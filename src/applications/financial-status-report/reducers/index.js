import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import vapService from '@@vap-svc/reducers';

import formConfig from '../config/form';
import {
  FSR_API_CALL_INITIATED,
  FSR_API_ERROR,
  FSR_RESET_ERRORS,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  GMT_FETCH_INITIATED,
  GMT_FETCH_SUCCESS,
  GMT_FETCH_FAILURE,
} from '../constants/actionTypes';
import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
} from '../actions/copays';

const initialState = {
  isError: false,
  errorCode: {},
  pending: true,
  pendingCopays: true,
  gmtData: null,
  gmtLoading: false,
  gmtError: null,
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
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        debtError: action.error,
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
    case GMT_FETCH_INITIATED:
      return {
        ...state,
        gmtLoading: true,
        gmtError: null,
      };
    case GMT_FETCH_SUCCESS:
      return {
        ...state,
        gmtData: action.payload,
        gmtLoading: false,
      };
    case GMT_FETCH_FAILURE:
      return {
        ...state,
        gmtError: action.error,
        gmtLoading: false,
      };
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  fsr: fsrApi,
  vapService,
};
