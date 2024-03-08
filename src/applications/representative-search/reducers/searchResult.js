import {
  CLEAR_SEARCH_RESULTS,
  SEARCH_COMPLETE,
  // SEARCH_FAILED,
  FETCH_REPRESENTATIVES,
  REPORT_INITIALIZED,
  REPORT_SUBMITTED,
  REPORT_COMPLETE,
  REPORT_FAILED,
  REPORT_ITEMS_UPDATED,
} from '../utils/actionTypes';

const INITIAL_STATE = {
  searchResults: [],
  reportedResults: [],
  reportSubmissionStatus: 'INITIAL',
  reportSubmissionInProgress: false,
  pagination: {},
};

import { appendReportsFromLocalStorage } from '../utils/helpers';

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_REPRESENTATIVES:
    case SEARCH_COMPLETE:
      return {
        ...state,
        searchResults: appendReportsFromLocalStorage(action.payload.data),
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
      };
    case REPORT_SUBMITTED:
      return {
        ...state,
        ...action.payload,
        reportSubmissionInProgress: true,
      };
    case REPORT_INITIALIZED:
      return {
        ...state,
        ...action.payload,
        reportSubmissionStatus: 'INITIAL',
      };
    case REPORT_COMPLETE:
      return {
        ...state,
        reportSubmissionInProgress: false,
        reportSubmissionStatus: 'SUCCESS',
        searchResults: appendReportsFromLocalStorage([...state.searchResults]),
      };
    case REPORT_FAILED:
      return {
        ...state,
        reportSubmissionInProgress: false,
        reportSubmissionStatus: 'FAILED',
      };
    case REPORT_ITEMS_UPDATED:
      return {
        ...state,
        reportSubmissionInProgress: false,
        reportedResults: action.payload,
      };
    // case SEARCH_FAILED:
    //   if (action.error) {
    //     return {
    //       ...INITIAL_STATE,
    //       isErrorFetchRepresentatives: action.error,
    //     };
    //   }
    //   return INITIAL_STATE;
    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
