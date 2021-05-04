// Dependencies
import cloneDeep from 'lodash/cloneDeep';

// Relative imports.
import { sortTheResults } from '../helpers';
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  INITIAL_SORT_STATE,
  TEST_OPTION_RELEVANCE,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../constants';

const initialState = {
  error: '',
  fetching: false,
  page: 1,
  query: '',
  sortByPropertyName: INITIAL_SORT_STATE,
  results: null,
  lighthouseTestSearchResults: null,
  hasOnlyRetiredForms: false,
  startIndex: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FORMS: {
      return { ...state, error: '', fetching: true, query: action.query };
    }
    case FETCH_FORMS_FAILURE: {
      return { ...state, error: action.error, fetching: false };
    }
    case FETCH_FORMS_SUCCESS: {
      const clonedResults = cloneDeep(action.results);
      if (
        !state.lighthouseTestSearchResults &&
        state.sortByPropertyName === TEST_OPTION_RELEVANCE
      ) {
        // NOTE: This is only for testing Lighthouse Search Algorithm
        return {
          ...state,
          fetching: false,
          hasOnlyRetiredForms: action.hasOnlyRetiredForms,
          lighthouseTestSearchResults: clonedResults,
          results: clonedResults,
        };
      }
      return {
        ...state,
        fetching: false,
        hasOnlyRetiredForms: action.hasOnlyRetiredForms,
        results:
          state.sortByPropertyName === TEST_OPTION_RELEVANCE
            ? state.lighthouseTestSearchResults // NOTE: This is only for testing Lighthouse Search Algorithm
            : clonedResults.sort((a, b) =>
                sortTheResults(state.sortByPropertyName, a, b),
              ),
      };
    }
    case UPDATE_HOW_TO_SORT: {
      return { ...state, sortByPropertyName: action.sortByPropertyName };
    }
    case UPDATE_RESULTS: {
      const clonedResults = cloneDeep(action.results);
      return {
        ...state,
        results:
          state.sortByPropertyName === TEST_OPTION_RELEVANCE
            ? state.lighthouseTestSearchResults // NOTE: This is only for testing Lighthouse Search Algorithm
            : clonedResults.sort((a, b) =>
                sortTheResults(state.sortByPropertyName, a, b),
              ),
      };
    }
    case UPDATE_PAGINATION: {
      return { ...state, page: action.page, startIndex: action.startIndex };
    }
    default: {
      return { ...state };
    }
  }
};
