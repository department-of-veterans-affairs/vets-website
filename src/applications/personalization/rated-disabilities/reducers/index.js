import set from 'platform/utilities/data/set';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
} from '../actions';

const initialState = {
  ratedDisabilities: null,
};

function ratedDisabilities(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATED_DISABILITIES_SUCCESS:
      return set('ratedDisabilities', action.response, state);

    case FETCH_RATED_DISABILITIES_FAILED:
      return set('ratedDisabilities', action.response, state);

    default:
      return state;
  }
}

export default {
  ratedDisabilities,
};
