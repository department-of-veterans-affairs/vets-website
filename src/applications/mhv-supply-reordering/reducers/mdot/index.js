import { MDOT_API_STATES } from '../../constants';

/**
 * The initial state for this app.
 */
const initialState = {
  isError: false,
  errorCode: '',
  statusCode: '',
  pending: true,
  data: null,
};

/**
 * Sets the state with MDOT API related data and errors.
 * @param {*} state the state
 * @param {*} action the dispatch action
 * @returns the updated state
 */
export function mdotApiResults(state = initialState, action) {
  switch (action.type) {
    case MDOT_API_STATES.ERROR:
      return {
        ...state,
        isError: true,
        errorCode: action.errorCode,
        statusCode: action.statusCode,
        pending: false,
        data: null,
      };
    case MDOT_API_STATES.SUCCESS:
      return {
        ...state,
        isError: false,
        errorCode: '',
        statusCode: action.statusCode,
        pending: false,
        data: action.data,
      };
    case MDOT_API_STATES.PENDING:
      return {
        ...state,
        isError: false,
        errorCode: '',
        statusCode: '',
        pending: true,
        data: null,
      };
    default:
      return state;
  }
}
