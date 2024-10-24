import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import { MDOT_API_STATES } from '../constants';

const initialState = {
  isError: false,
  errorCode: '',
  pending: true,
  nextAvailabilityDate: '',
};

export function mdotApiErrors(state = initialState, action) {
  switch (action.type) {
    case MDOT_API_STATES.ERROR:
      return {
        ...state,
        isError: true,
        errorCode: action.error,
        nextAvailabilityDate: action.nextAvailabilityDate,
        pending: false,
      };
    case MDOT_API_STATES.MDOT_RESET_ERRORS:
      return {
        ...initialState,
        pending: false,
      };
    case MDOT_API_STATES.S:
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
