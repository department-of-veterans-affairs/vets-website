import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
  DEBT_LETTERS_FETCH_SUCCESS,
  DEBT_LETTERS_FETCH_FAILURE,
} from '../actions';

const initialState = {
  isPending: false,
  isError: false,
  isVBMSError: false,
  debts: [],
  selectedDebt: {},
  debtLinks: [],
};

export const debtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEBTS_FETCH_INITIATED:
      return {
        ...state,
        isPending: true,
        isError: false,
        isVBMSError: false,
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
      };
    case DEBTS_SET_ACTIVE_DEBT:
      return {
        ...state,
        selectedDebt: action.debt,
      };
    case DEBT_LETTERS_FETCH_SUCCESS:
      return {
        ...state,
        debtLinks: action.debtLinks,
        isVBMSError: false,
      };
    case DEBT_LETTERS_FETCH_FAILURE:
      return {
        ...state,
        isPending: false,
        isVBMSError: true,
      };
    default:
      return state;
  }
};

export default { debtLetters: debtsReducer };
