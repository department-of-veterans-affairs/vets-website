import {
  CLEAR_SEARCH_RESULTS,
  SEARCH_COMPLETE,
  FETCH_REPRESENTATIVES,
  REPORT_STARTED,
  REPORT_COMPLETE,
  REPORT_FAILED,
} from '../utils/actionTypes';

const INITIAL_STATE = {
  searchResults: [],
  reportedResults: [],
  reportError: false,
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_REPRESENTATIVES:
    case SEARCH_COMPLETE:
      return {
        ...state,
        error: null,
        searchResults: action.payload.data,
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
      };
    case REPORT_STARTED:
      return {
        ...state,
        ...action.payload,
        error: false,
        reportSubmissionInProgress: true,
      };
    case REPORT_COMPLETE:
      return {
        ...state,
        error: null,
        reportSubmissionInProgress: false,
        reportedResults: action.payload.result,
      };
    case REPORT_FAILED:
      if (action.error) {
        return {
          ...state,
          reportError: action.error,
        };
      }
      return state;
    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
