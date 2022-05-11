import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../actions/debts';

const initialState = {
  isLoading: false,
  isError: false,
  debts: [],
  errors: [],
  hasDependentDebts: false,
};

export const debtsReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEBTS_FETCH_INITIATED:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case DEBTS_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        debts: action.debts,
        hasDependentDebts: action.hasDependentDebts,
      };
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errors: action.errors,
      };
    default:
      return state;
  }
};

export default debtsReducer;
