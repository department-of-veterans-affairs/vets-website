import { FETCH_TOGGLE_VALUES_STARTED } from 'platform/site-wide/feature-toggles/actionTypes';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';
import { combineReducers } from 'redux';
import {
  MCP_STATEMENTS_FETCH_INIT,
  MCP_STATEMENTS_FETCH_SUCCESS,
  MCP_STATEMENTS_FETCH_FAILURE,
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  DEBT_LETTERS_FETCH_INITIATED,
} from '../actions/debts';

const debtInitialState = {
  isProfileUpdating: true,
  isPending: false,
  isPendingVBMS: false,
  isError: false,
  isVBMSError: false,
  debts: [],
  selectedDebt: {},
  debtLinks: [],
  errors: [],
  hasDependentDebts: false,
};

const mcpInitialState = {
  pending: false,
  error: null,
  statements: null,
};

export const medicalCopaysReducer = (state = mcpInitialState, action) => {
  switch (action.type) {
    case MCP_STATEMENTS_FETCH_INIT:
      return {
        ...state,
        pending: true,
      };
    case MCP_STATEMENTS_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        statements: action.response,
      };
    case MCP_STATEMENTS_FETCH_FAILURE:
      return {
        ...state,
        pending: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export const debtsReducer = (state = debtInitialState, action) => {
  switch (action.type) {
    case DEBTS_FETCH_INITIATED:
      return {
        ...state,
        isPending: true,
        isError: false,
      };
    case DEBTS_FETCH_SUCCESS:
      return {
        ...state,
        isPending: false,
        isError: false,
        debts: action.debts,
        hasDependentDebts: action.hasDependentDebts,
      };
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        isPending: false,
        isError: true,
        errors: action.errors,
      };
    case DEBTS_SET_ACTIVE_DEBT:
      return {
        ...state,
        selectedDebt: action.debt,
      };
    case DEBT_LETTERS_FETCH_INITIATED:
      return {
        ...state,
        isPendingVBMS: true,
        isError: false,
      };
    case DEBT_LETTERS_FETCH_SUCCESS:
      return {
        ...state,
        debtLinks: action.debtLinks,
        isVBMSError: false,
        isPendingVBMS: false,
      };
    case DEBT_LETTERS_FETCH_FAILURE:
      return {
        ...state,
        isPending: false,
        isPendingVBMS: false,
        isVBMSError: true,
      };
    case FETCH_TOGGLE_VALUES_STARTED:
      return {
        ...state,
        isProfileUpdating: true,
      };
    case UPDATE_LOGGEDIN_STATUS:
      return {
        ...state,
        isProfileUpdating: false,
      };
    default:
      return state;
  }
};

export default {
  combinedPortal: combineReducers({
    mcp: medicalCopaysReducer,
    debtLetters: debtsReducer,
  }),
};
