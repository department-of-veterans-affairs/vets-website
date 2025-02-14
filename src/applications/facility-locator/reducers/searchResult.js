import {
  CLEAR_SEARCH_RESULTS,
  FETCH_LOCATION_DETAIL,
  FETCH_LOCATIONS,
  MOBILE_MAP_PIN_SELECTED,
  SEARCH_FAILED,
} from '../actions/actionTypes';

export const INITIAL_STATE = {
  mobileMapPinSelected: null,
  results: [],
  selectedResult: null,
  pagination: {},
};

export const SearchResultReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_LOCATIONS:
      return {
        ...state,
        error: null,
        results: action.payload.data,
        pagination: action.payload.meta.pagination,
        resultTime: action.payload.meta.resultTime,
      };
    case FETCH_LOCATION_DETAIL:
      return {
        ...state,
        selectedResult: action.payload,
      };
    case SEARCH_FAILED:
      if (action.error) {
        return {
          ...INITIAL_STATE,
          error: action.error,
        };
      }
      return INITIAL_STATE;
    case MOBILE_MAP_PIN_SELECTED:
      return {
        ...state,
        mobileMapPinSelected: action.payload,
      };
    case CLEAR_SEARCH_RESULTS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
