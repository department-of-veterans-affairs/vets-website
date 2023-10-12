import {
  FETCH_TOTAL_RATING_STARTED,
  FETCH_TOTAL_RATING_SUCCEEDED,
  FETCH_TOTAL_RATING_FAILED,
} from '../../../common/actions/ratedDisabilities';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  totalDisabilityRating: null,
  disabilityDecisionTypeName: null,
};

export function totalRating(state = initialState, action) {
  switch (action.type) {
    case FETCH_TOTAL_RATING_STARTED:
      return {
        ...initialState,
      };
    case FETCH_TOTAL_RATING_FAILED:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case FETCH_TOTAL_RATING_SUCCEEDED:
      return {
        ...state,
        loading: false,
        totalDisabilityRating: action.response.userPercentOfDisability,
        disabilityDecisionTypeName: action.response.disabilityDecisionTypeName,
      };
    default:
      return state;
  }
}
