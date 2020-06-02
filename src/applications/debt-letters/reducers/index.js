import reverse from 'lodash/reverse';
import {
  DEBTS_FETCH_INITIATED,
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
} from '../actions';

const initialState = {
  isPending: false,
  isError: false,
  debts: [],
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
        debts: reverse(action.debts),
      };
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        isPending: false,
        isError: true,
      };
    default:
      return state;
  }
};

export default { debtLetters: debtsReducer };
