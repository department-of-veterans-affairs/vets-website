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
          code: action.errors.code,
          detail: action.errors.detail, // This changes when the backend gets wired up to the frontend.
        },
      };
    case FETCH_TOTAL_RATING_SUCCEEDED:
      return {
        ...state,
        loading: false,
        error: null,
        totalDisabilityRating: action.response.userPercentOfDisability, // to be replaced with response payload
      };
    default:
      return state;
  }
}
