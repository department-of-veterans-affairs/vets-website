import {
  FETCH_RATING_INFO_STARTED,
  FETCH_RATING_INFO_SUCCESS,
  FETCH_RATING_INFO_FAILED,
} from '../actions/ratingInfo';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  serviceConnectedCombinedDegree: null,
};

const minRating = 30;

/**
 *
 * @param {*} state
 * @param {*} action
 * @returns
 */
function ratingValue(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATING_INFO_STARTED:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_RATING_INFO_SUCCESS:
      if (action.response.service_connected_combined_degree >= minRating) {
        return {
          ...state,
          loading: false,
          hasMinimumRating: true,
        };
      }
      return {
        ...state,
        loading: false,
      };

    case FETCH_RATING_INFO_FAILED:
      // We are assigning the 'status' to the state variable 'code' because the API calls it a status
      // but in the application we treat it as an error code
      return {
        ...state,
        loading: false,
        error: {
          code: action.response.errors[0].status,
        },
      };
    default:
      return state;
  }
}

export default ratingValue;
