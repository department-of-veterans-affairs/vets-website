import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

import {
  DEBTS_FETCH_SUCCESS,
  DEBTS_FETCH_FAILURE,
  DEBTS_FETCH_INITIATED,
} from '../constants';

const initialState = {
  isDebtError: false,
  debtError: '',
  availableDebts: [],
};

const availableDebts = (state = initialState, action) => {
  switch (action.type) {
    case DEBTS_FETCH_INITIATED:
      return {
        ...state,
        isDebtPending: true,
      };
    case DEBTS_FETCH_SUCCESS:
      return {
        ...state,
        availableDebts: action.debts,
        isDebtPending: false,
      };
    case DEBTS_FETCH_FAILURE:
      return {
        ...state,
        isDebtError: true,
        debtError: action.error,
        isDebtPending: false,
      };
    default:
      return state;
  }
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  availableDebts,
};
