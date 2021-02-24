import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  DEBT_LETTERS_FETCH_INITIATED,
} from '../actions';

import { FETCH_TOGGLE_VALUES_STARTED } from 'platform/site-wide/feature-toggles/actionTypes';
import { UPDATE_LOGGEDIN_STATUS } from 'platform/user/authentication/actions';

const initialState = {
  isProfileUpdating: true,
  isPending: false,
  isPendingVBMS: false,
  isError: false,
  isVBMSError: false,
  debts: [],
  selectedDebt: {},
  debtLinks: [],
  errors: [],
};

export const debtsReducer = (state = initialState, action) => {
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

export default { debtLetters: debtsReducer };
