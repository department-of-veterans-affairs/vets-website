import {
  FETCH_VA_FACILITY,
  FETCH_VA_FACILITIES,
  FETCH_CC_PROVIDERS,
  SEARCH_FAILED
} from '../utils/actionTypes';

const INITIAL_STATE = {
  results: [],
  selectedResult: null,
  pagination: {}
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_VA_FACILITY:
      return {
        ...state,
        selectedResult: action.payload,
      };
    case FETCH_VA_FACILITIES:
      return {
        ...state,
        results: action.payload.data,
        pagination: action.payload.meta.pagination,
      };
    case FETCH_CC_PROVIDERS:
      return {
        ...state,
        results: action.payload.data,
        pagination: action.payload.meta.pagination
      };
    case SEARCH_FAILED:
      return INITIAL_STATE;
    default:
      return state;
  }
};
