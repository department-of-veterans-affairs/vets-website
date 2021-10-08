import {
  DEBTS_FETCH_INIT,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
  DEBT_LETTERS_FETCH_INIT,
  DEBTS_SET_ACTIVE_DEBT,
} from '../actions';

const initialState = {
  pending: false,
  pendingVBMS: false,
  isError: false,
  isVBMSError: false,
  selectedDebt: {},
  hasDependentDebts: false,
  debts: [],
  debtLinks: [],
};

export const debtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEBTS_FETCH_INIT:
      return {
        ...state,
        pending: true,
        isError: false,
      };
    case DEBTS_FETCH_SUCCESS:
      return {
        ...state,
        pending: false,
        isError: false,
        debts: action.debts,
        hasDependentDebts: action.hasDependentDebts,
      };
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        pending: false,
        isError: true,
      };
    case DEBTS_SET_ACTIVE_DEBT:
      return {
        ...state,
        selectedDebt: action.debt,
      };
    case DEBT_LETTERS_FETCH_INIT:
      return {
        ...state,
        pendingVBMS: true,
        isError: false,
      };
    case DEBT_LETTERS_FETCH_SUCCESS:
      return {
        ...state,
        debtLinks: action.debtLinks,
        isVBMSError: false,
        pendingVBMS: false,
      };
    case DEBT_LETTERS_FETCH_FAILURE:
      return {
        ...state,
        pending: false,
        pendingVBMS: false,
        isVBMSError: true,
      };
    default:
      return state;
  }
};

export default { debtLetters: debtsReducer };
