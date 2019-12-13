// Relative imports.
import {
  FETCH_FORMS,
  FETCH_FORMS_FAILURE,
  FETCH_FORMS_SUCCESS,
  UPDATE_RESULTS,
} from '../constants';

import { normalizeFormsForTable } from '../helpers';

const initialState = {
  fetching: false,
  query: '',
  results: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FORMS: {
      return { ...state, fetching: true, query: action.query };
    }
    case FETCH_FORMS_FAILURE: {
      return { ...state, fetching: false };
    }
    case FETCH_FORMS_SUCCESS: {
      // Normalize the forms data we get back from the API resopnse.
      const results = normalizeFormsForTable(action.response);
      return { ...state, fetching: false, results };
    }
    case UPDATE_RESULTS: {
      return { ...state, results: action.results };
    }
    default: {
      return { ...state };
    }
  }
};
