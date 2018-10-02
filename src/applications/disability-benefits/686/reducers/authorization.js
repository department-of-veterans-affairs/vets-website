import {
  LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
  LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
  LOAD_30_PERCENT_DISABILITY_RATING_FAILED,
} from '../actions';

const initialState = {
  isLoading: false,
  hasError: false,
  payload: null,
};

function authorizationReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_30_PERCENT_DISABILITY_RATING_STARTED:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        hasError: false,
        payload: action.payload,
      };
    case LOAD_30_PERCENT_DISABILITY_RATING_FAILED:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        payload: action.error,
      };
    default:
      return state;
  }
}
export default authorizationReducer;
