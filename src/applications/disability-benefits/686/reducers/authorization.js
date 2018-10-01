import {
  LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
  LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
  LOAD_30_PERCENT_DISABILITY_RATING_FAILED
} from '../actions';

const initialState = {
  isLoading: false,
  hasError: false,
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
        hasError: !action.payload.has30Percent,
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
