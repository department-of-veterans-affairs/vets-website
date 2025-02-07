import {
  FETCH_LC_RESULTS_STARTED,
  FETCH_LC_RESULTS_SUCCEEDED,
  FETCH_LC_RESULTS_FAILED,
  FETCH_LC_RESULT_STARTED,
  FETCH_LC_RESULT_SUCCEEDED,
  FETCH_LC_RESULT_FAILED,
  FILTER_LC_RESULTS,
} from '../actions';
import { filterSuggestions } from '../utils/helpers';

export const INITIAL_STATE = {
  fetchingLc: true,
  lcResults: [],
  filteredResults: [],
  hasFetchedOnce: false,
  fetchingLcResult: false,
  hasFetchedResult: false,
  lcResultInfo: {},
  error: null,
};

export default function(state = INITIAL_STATE, action) {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case FETCH_LC_RESULTS_STARTED:
      return {
        ...newState,
        fetchingLc: true,
      };
    case FETCH_LC_RESULTS_SUCCEEDED:
      return {
        ...newState,
        fetchingLc: false,
        lcResults: action.payload,
        hasFetchedOnce: true,
        error: false,
        filteredResults: action.payload,
      };
    case FETCH_LC_RESULTS_FAILED:
      return {
        ...newState,
        fetchingLc: false,
        error: action.payload,
      };
    case FETCH_LC_RESULT_STARTED:
      return {
        ...newState,
        fetchingLcResult: true,
      };
    case FETCH_LC_RESULT_SUCCEEDED: {
      return {
        ...newState,
        fetchingLcResult: false,
        lcResultInfo: action.payload,
        hasFetchedResult: true,
      };
    }
    case FETCH_LC_RESULT_FAILED:
      return {
        ...newState,
        fetchingLcResult: false,
        error: action.payload,
      };
    case FILTER_LC_RESULTS: {
      const { name, categories, location } = action.payload;

      const newSuggestions = filterSuggestions(
        newState.lcResults,
        name,
        categories,
        location,
      );

      if (name.trim() !== '') {
        newSuggestions.unshift({
          lacNm: name,
          type: 'all',
        });
      }

      return {
        ...newState,
        filteredResults: newSuggestions,
      };
    }
    default:
      return { ...state };
  }
}
