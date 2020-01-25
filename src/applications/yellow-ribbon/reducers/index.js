// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  UPDATE_PAGE,
} from '../constants';

const initialState = {
  city: '',
  error: '',
  fetching: false,
  name: '',
  page: 1,
  perPage: 10,
  results: undefined,
  state: '',
  totalResults: undefined,
};

const yellowRibbonReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESULTS: {
      return {
        ...state,
        city: action?.options?.city || '',
        error: '',
        fetching: !action?.options?.hideFetchingState,
        name: action?.options?.name || '',
        state: action?.options?.state || '',
      };
    }
    case FETCH_RESULTS_FAILURE: {
      return { ...state, error: action.error, fetching: false };
    }
    case FETCH_RESULTS_SUCCESS: {
      return {
        ...state,
        fetching: false,
        results: action?.response?.results,
        totalResults: action?.response?.totalResults,
      };
    }
    case UPDATE_PAGE: {
      return { ...state, page: action.page };
    }
    default: {
      return { ...state };
    }
  }
};

export default {
  yellowRibbonReducer,
};
