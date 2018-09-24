import { requestStates } from '../../../../platform/utilities/constants';
import {
  LOAD_DISABILITY_RATING_STARTED,
  LOAD_DISABILITY_RATING_SUCCEEDED,
  LOAD_DISABILITY_RATING_FAILED
} from '../actions';

const initialState = {
  isLoading: false,
  hasError: false,
  disabilityRatingState: requestStates.notCalled,
  payload: null,
};

function authorizationReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_DISABILITY_RATING_STARTED:
      return {
        ...state,
        isLoading: true,
        hasError: false,
        disabilityRatingState: requestStates.pending,
      };
    case LOAD_DISABILITY_RATING_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        hasError: false,
        disabilityRatingState: requestStates.succeeded,
        payload: action.payload,
      };
    case LOAD_DISABILITY_RATING_FAILED:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        disabilityRatingState: requestStates.failed,
        payload: action.error,
      };
    default:
      return state;
  }
}
export default authorizationReducer;
