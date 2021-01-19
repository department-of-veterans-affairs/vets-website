// Relative imports.
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  INITIAL_SORT_STATE,
  UPDATE_HOW_TO_SORT,
  UPDATE_PAGINATION,
  UPDATE_RESULTS,
} from '../constants';

const initialState = {
  error: '',
  fetching: false,
  page: 1,
  query: '',
  howToSort: INITIAL_SORT_STATE,
  results: null,
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
      return {
        ...state,
        fetching: false,
        hasOnlyRetiredForms: action.hasOnlyRetiredForms,
        results: action.results,
      };
    }
    case UPDATE_HOW_TO_SORT: {
      return { ...state, howToSort: action.howToSort };
    }
    case UPDATE_RESULTS: {
      return { ...state, results: action.results };
    }
    case UPDATE_PAGINATION: {
      return { ...state, page: action.page, startIndex: action.startIndex };
    }
    default: {
      return { ...state };
    }
  }
};
