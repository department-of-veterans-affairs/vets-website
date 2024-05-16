import {
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_UNAUTH_PING_STARTED,
  FETCH_UNAUTH_PING_SUCCESS,
  FETCH_UNAUTH_PING_FAILURE,
} from './actions';

const initialState = {
  isLoading: false,
  isError: false,
  isFetchingUnauthPing: false,
  unauthPingResponse: null,
  travelClaims: [],
  error: null,
};

function travelClaimsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRAVEL_CLAIMS_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_TRAVEL_CLAIMS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        travelClaims: action.payload,
      };
    case FETCH_TRAVEL_CLAIMS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    /* istanbul ignore next */
    case FETCH_UNAUTH_PING_STARTED:
      return {
        ...state,
        isFetchingUnauthPing: true,
      };
    /* istanbul ignore next */
    case FETCH_UNAUTH_PING_SUCCESS:
      return {
        ...state,
        isFetchingUnauthPing: false,
        unauthPingResponse: action.payload,
      };
    /* istanbul ignore next */
    case FETCH_UNAUTH_PING_FAILURE:
      return {
        ...state,
        isFetchingUnauthPing: false,
      };
    default:
      return state;
  }
}

export default {
  travelPay: travelClaimsReducer,
};
