// Relative imports.
import {
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  TOGGLE_SHOW_MOBILE_FORM,
} from '../constants';

const initialState = {
  error: '',
  fetching: false,
  hasFetchedOnce: false,
  page: 1,
  perPage: 10,
  results: undefined,
  showMobileForm: true,
  totalResults: undefined,
  // For comparing:
  schoolIDs: [],
  schoolsLookup: {},
};

export const yellowRibbonReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESULTS: {
      return {
        ...state,
        error: '',
        fetching: !action?.options?.hideFetchingState,
        hasFetchedOnce: true,
        page: action?.options?.page || state?.page,
        showMobileForm: false,
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
    case TOGGLE_SHOW_MOBILE_FORM: {
      return { ...state, showMobileForm: !state.showMobileForm };
    }
    default: {
      return { ...state };
    }
  }
};

export default {
  yellowRibbonReducer,
};
