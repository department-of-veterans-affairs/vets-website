import {
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_FAILURE,
} from '../actions';

const initialState = {
  results: [],
  loading: false,
  error: null,
};

function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS: {
      return {
        ...state,
        loading: true,
      };
    }

    case FETCH_SEARCH_RESULTS_SUCCESS: {
      const { query } = action.results;
      const { results, nextOffset, total } = action.results.web;

      return {
        ...state,
        query,
        results,
        total,
        nextOffset,
        loading: false,
      };
    }

    case FETCH_SEARCH_RESULTS_FAILURE: {
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    }

    default:
      return state;
  }
}

export default {
  search: SearchReducer,
};
