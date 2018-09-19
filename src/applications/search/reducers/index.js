import {
  FETCH_SEARCH_RESULTS
} from '../actions';

const initialState = {
  results: []
};

function SearchReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_SEARCH_RESULTS: {
      return {
        // clone the current state
        ...state,

        // overrides the search.results property
        results: action.results
      };
    }

    default:
      return state;
  }
}

export default {
  search: SearchReducer
};
