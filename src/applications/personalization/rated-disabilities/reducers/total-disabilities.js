import {
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../actions/index';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  totalDisabilityRating: null,
};

export function totalRating(state = initialState, action) {
  switch (action.type) {
    case FETCH_TOTAL_RATING_FAILED:
      return {
        ...state,
        loading: false,
        error: {
          code: action.response.errors[0].code,
          detail: action.response.errors[0].detail,
        },
      };
    case FETCH_TOTAL_RATING_SUCCEEDED:
      return {
        ...state,
        loading: false,
        totalDisabilityRating: action.response.userPercentOfDisability,
      };
    default:
      return state;
  }
}
