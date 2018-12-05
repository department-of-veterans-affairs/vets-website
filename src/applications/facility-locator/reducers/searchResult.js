import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  SEARCH_FAILED,
  CLEAR_SEARCH_RESULTS,
} from '../utils/actionTypes';
// import { captureMessage } from 'raven-js';

const INITIAL_STATE = {
  results: [],
  selectedResult: null,
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_LOCATIONS:
      return {
        ...state,
        results: action.payload.data,
        pagination: action.payload.meta.pagination,
      };
    case FETCH_LOCATION_DETAIL:
      return {
        ...state,
        selectedResult: action.payload,
      };
    case SEARCH_FAILED:
      if (action.error) {
        // Log error with Sentry
        // TODO: Figure out why this is causing errors so we can capture correctly
        // captureMessage(`Locator Search Failed: ${action.error}`);
      }
      return INITIAL_STATE;
    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
