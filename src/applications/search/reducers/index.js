import {
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_SUCCESS,
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_EMPTY,
} from '../actions';

const initialState = {
  searchesPerformed: 0,
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
        results: undefined,
        recommendedResults: undefined,
      };
    }

    case FETCH_SEARCH_RESULTS_SUCCESS: {
      const { query } = action.results;
      const {
        currentPage,
        perPage,
        totalPages,
        totalEntries,
      } = action.meta.pagination;
      const { results } = action.results.web;
      const recommendedResults = action.results.textBestBets;
      const spellingCorrection = action.results.web.spellingCorrection;
      const searchesPerformed = state.searchesPerformed + 1;

      return {
        ...state,
        query,
        recommendedResults,
        spellingCorrection,
        results,
        totalEntries,
        currentPage,
        perPage,
        totalPages,
        searchesPerformed,
        errors: undefined,
        loading: false,
      };
    }

    case FETCH_SEARCH_RESULTS_FAILURE: {
      return {
        ...state,
        recommendedResults: undefined,
        errors: action.errors,
        results: undefined,
        loading: false,
      };
    }

    case FETCH_SEARCH_RESULTS_EMPTY: {
      return {
        ...state,
        loading: false,
        spellingCorrection: undefined,
      };
    }

    default:
      return state;
  }
}

export default {
  search: SearchReducer,
};
