import {
  FETCH_REPRESENTATIVES_INIT,
  FETCH_REPRESENTATIVES_SUCCEEDED,
  FETCH_REPRESENTATIVES_FAILED,
} from '../actions';

const INITIAL_STATE = {
  status: '',
  searchResults: [],
  errors: [],
};

export const representativeSearchReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_REPRESENTATIVES_INIT:
      return {
        ...state,
        status: FETCH_REPRESENTATIVES_INIT,
      };
    case FETCH_REPRESENTATIVES_SUCCEEDED:
      return {
        ...state,
        status: FETCH_REPRESENTATIVES_SUCCEEDED,
        searchResults: action.payload.data,
        errors: [],
      };
    case FETCH_REPRESENTATIVES_FAILED:
      return {
        ...state,
        status: FETCH_REPRESENTATIVES_FAILED,
      };
    default:
      return state;
  }
};
