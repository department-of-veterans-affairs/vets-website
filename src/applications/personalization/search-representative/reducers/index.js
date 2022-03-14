import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import {
  FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS,
  FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED,
} from '../actions';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  representativeSearchResults: [],
};

function allSearchResults(state = initialState, action) {
  switch (action.type) {
    case FETCH_REPRESENTATIVE_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: false,
        representativeSearchResults: action.response.data,
      };
    case FETCH_REPRESENTATIVE_SEARCH_RESULTS_FAILED:
      return {
        ...state,
        loading: false,
        error: true,
      };
    default:
      return state;
  }
}

export default {
  form: createSaveInProgressFormReducer(formConfig),
  allSearchResults,
};
