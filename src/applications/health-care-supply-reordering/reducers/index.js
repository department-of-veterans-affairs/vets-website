import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import {
  MDOT_API_CALL_INITIATED,
  MDOT_API_ERROR,
  MDOT_RESET_ERRORS,
} from '../constants';

const initialState = {
  isError: false,
  errorCode: '',
  pending: true,
  nextAvailabilityDate: '',
};

export function mdotApiErrors(state = initialState, action) {
  switch (action.type) {
    case MDOT_API_ERROR:
      return {
        ...state,
        isError: true,
        errorCode: action.error,
        nextAvailabilityDate: action.nextAvailabilityDate,
        pending: false,
      };
    case MDOT_RESET_ERRORS:
      return {
        ...initialState,
        pending: false,
      };
    case MDOT_API_CALL_INITIATED:
      return {
        ...state,
        pending: true,
      };
    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  mdot: mdotApiErrors,
};
