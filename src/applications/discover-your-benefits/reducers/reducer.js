import {
  FETCH_RESULTS_STARTED,
  FETCH_RESULTS_SUCCESS,
  FETCH_RESULTS_FAILURE,
} from './actions';

const initialState = {
  isLoading: false,
  isError: false,
  data: [],
  error: null,
};

function resultsReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_RESULTS_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case FETCH_RESULTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        data: action.payload,
      };
    case FETCH_RESULTS_FAILURE:
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
  results: resultsReducer,
};
