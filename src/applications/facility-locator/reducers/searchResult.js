import {
  FETCH_VA_FACILITY,
  FETCH_VA_FACILITIES,
  FETCH_CC_PROVIDERS,
  SEARCH_FAILED
} from '../utils/actionTypes';

const INITIAL_STATE = {
  facilities: [],
  providers: [],
  selectedFacility: null,
  pagination: {}
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_VA_FACILITY:
      return {
        ...state,
        selectedFacility: action.payload,
      };
    case FETCH_VA_FACILITIES:
      return {
        ...state,
        facilities: action.payload.data,
        pagination: action.payload.meta.pagination,
      };
    case FETCH_CC_PROVIDERS:
      return {
        ...state,
        providers: action.payload.data,
        pagination: action.payload.meta.pagination
      };
    case SEARCH_FAILED:
      return INITIAL_STATE;
    default:
      return state;
  }
};
