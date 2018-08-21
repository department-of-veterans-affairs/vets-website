import {
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  SEARCH_FAILED
} from '../utils/actionTypes';

const INITIAL_STATE = {
  results: [],
  selectedResult: null,
  pagination: {}
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
      return INITIAL_STATE;
    default:
      return state;
  }
};
