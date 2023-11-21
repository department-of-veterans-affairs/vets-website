import {
  SEARCH_FAILED,
  CLEAR_SEARCH_RESULTS,
  SEARCH_COMPLETE,
} from '../utils/actionTypes';

// import mockRepresentativeData from '../constants/mock-representative-data.json';

const INITIAL_STATE = {
  error: null,
  searchResults: [],
  selectedResult: null,
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SEARCH_COMPLETE:
      return {
        ...state,
        error: null,
        searchResults: action.payload.data,
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
      };
    case SEARCH_FAILED:
      if (action.error) {
        return {
          ...INITIAL_STATE,
          error: action.error,
        };
      }
      return INITIAL_STATE;
    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
