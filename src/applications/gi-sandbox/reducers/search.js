import {
  SEARCH_STARTED,
  SEARCH_FAILED,
  SEARCH_BY_LOCATION_SUCCEEDED,
  SEARCH_BY_NAME_SUCCEEDED,
} from '../actions';

const INITIAL_STATE = {
  results: [],
  count: null,
  version: {},
  query: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
  inProgress: false,
  error: null,
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SEARCH_BY_LOCATION_SUCCEEDED:
      return { ...state, inProgress: false };

    case SEARCH_BY_NAME_SUCCEEDED:
      return { ...state, inProgress: false };

    case SEARCH_STARTED:
      return { ...state, inProgress: true };

    case SEARCH_FAILED:
      return {
        ...state,
        inProgress: false,
        error: action.payload,
      };

    default:
      return { ...state };
  }
}
