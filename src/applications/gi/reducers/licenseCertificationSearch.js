import {
  FETCH_LC_STARTED,
  FETCH_LC_SUCCEEDED,
  FETCH_LC_FAILED,
} from '../actions';

export const INITIAL_STATE = {
  fetchingLc: false,
  lcResults: [],
  error: null,
};

export default function(state = INITIAL_STATE, action) {
  const newState = {
    ...state,
  };

  switch (action.type) {
    case FETCH_LC_STARTED:
      return {
        ...newState,
        fetchingLc: true,
      };
    case FETCH_LC_SUCCEEDED:
      return {
        ...newState,
        fetchingLc: false,
        lcResults: action.payload,
      };
    case FETCH_LC_FAILED:
      return {
        ...newState,
        fetchingLc: false,
        error: action.payload,
      };
    default:
      return { ...state };
  }
}
