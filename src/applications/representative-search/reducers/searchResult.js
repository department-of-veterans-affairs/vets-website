import {
  CLEAR_SEARCH_RESULTS,
  SEARCH_COMPLETE,
  // SEARCH_FAILED,
  FETCH_REPRESENTATIVES,
} from '../utils/actionTypes';

const INITIAL_STATE = {
  searchResults: [],
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_REPRESENTATIVES:
    case SEARCH_COMPLETE:
      return {
        ...state,
        searchResults: action.payload.data,
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
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
