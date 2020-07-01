import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_SET_ACTIVE_DEBT,
} from '../actions';

const initialState = {
  isPending: false,
  isError: false,
  debts: [],
  selectedDebt: {},
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
      };
    case DEBTS_SET_ACTIVE_DEBT:
      return {
        ...state,
        selectedDebt: action.debt,
      };
    default:
      return state;
  }
};

export default { debtLetters: debtsReducer };
