import {
  FETCH_REPRESENTATIVES,
  SEARCH_FAILED,
  CLEAR_SEARCH_RESULTS,
  SORT_TYPE_UPDATED,
} from '../utils/actionTypes';

const INITIAL_STATE = {
  // loading: true, // app starts in loading state
  // error: null,
  results: [],
  sortedSearchResults: [],
  selectedResult: null,
  sortType: 'DISTANCE_ASC',
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_REPRESENTATIVES:
      return {
        ...state,
        error: null,
        results: action.payload.data,
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
      };
    case SORT_TYPE_UPDATED:
      return {
        ...state,
        ...action.payload,
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

// export default {
//   form: createSaveInProgressFormReducer(formConfig),
//   // allSearchResults,
// };
