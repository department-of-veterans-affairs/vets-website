import {
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
} from './actions';

const initialState = {
  isLoading: false,
  isError: false,
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
    default:
      return state;
  }
}

export default {
  travelPay: travelClaimsReducer,
};
