// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
} from '../constants';

const initialState = {
  error: '',
  fetching: false,
  page: 1,
  perPage: 10,
  results: undefined,
  totalResults: undefined,
};

export const thirdPartyAppsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESULTS: {
      return {
        ...state,
        error: '',
        fetching: !action?.options?.hideFetchingState,
        page: action?.options?.page || state?.page,
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
    default: {
      return { ...state };
    }
  }
};

export default {
  thirdPartyAppsReducer,
};
