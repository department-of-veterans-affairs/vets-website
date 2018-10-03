import {
  LOAD_30_PERCENT_DISABILITY_RATING_STARTED,
  LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED,
  LOAD_30_PERCENT_DISABILITY_RATING_FAILED,
} from '../actions';

const initialState = {
  isLoading: false,
  isAuthorized: false,
};

function authorizationReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_30_PERCENT_DISABILITY_RATING_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case LOAD_30_PERCENT_DISABILITY_RATING_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        isAuthorized: action.payload.has30Percent,
      };
    case LOAD_30_PERCENT_DISABILITY_RATING_FAILED:
      return {
        ...state,
        isLoading: false,
        isAuthorized: false,
        payload: action.error,
      };
    default:
      return state;
  }
}
export default authorizationReducer;
