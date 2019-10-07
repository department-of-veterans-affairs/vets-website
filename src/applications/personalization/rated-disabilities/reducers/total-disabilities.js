import {
  FETCH_TOTAL_RATING_SUCCESS,
  FETCH_TOTAL_RATING_FAILED,
} from '../actions/index';

const initialState = {
  loading: true, // app starts in loading state
  error: false,
  totalDisabilityRating: null,
};

export function totalRating (state = initialState, action) {
  switch (action.type) {
    case FETCH_TOTAL_RATING_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case FETCH_TOTAL_RATING_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        totalDisabilityRating: 80, // to be replaced with response payload
      };
    default:
      return state;
  }
}
