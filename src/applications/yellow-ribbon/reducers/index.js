// Dependencies
import concat from 'lodash/concat';
import filter from 'lodash/filter';
import pick from 'lodash/pick';
// Relative imports.
import {
  ADD_SCHOOL_TO_COMPARE,
  FETCH_RESULTS,
  FETCH_RESULTS_FAILURE,
  FETCH_RESULTS_SUCCESS,
  REMOVE_SCHOOL_FROM_COMPARE,
  UPDATE_PAGE,
} from '../constants';

const initialState = {
  error: '',
  fetching: false,
  hasFetchedOnce: false,
  page: 1,
  perPage: 10,
  results: undefined,
  totalResults: undefined,
  // For comparing:
  schoolIDs: [],
  schoolsLookup: {},
};

export const yellowRibbonReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SCHOOL_TO_COMPARE: {
      return {
        ...state,
        schoolIDs: concat(state.schoolIDs, action?.school?.id),
        schoolsLookup: {
          ...state.schoolsLookup,
          [action?.school?.id]: action?.school,
        },
      };
    }
    case FETCH_RESULTS: {
      return {
        ...state,
        error: '',
        fetching: !action?.options?.hideFetchingState,
        hasFetchedOnce: true,
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
    case REMOVE_SCHOOL_FROM_COMPARE: {
      // Derive the updated list of school IDs.
      const schoolIDs = filter(
        state.schoolIDs,
        id => id !== action?.school?.id,
      );

      return {
        ...state,
        schoolIDs,
        schoolsLookup: pick(state.schoolsLookup, schoolIDs),
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
