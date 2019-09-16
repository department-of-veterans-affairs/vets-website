import set from 'platform/utilities/data/set';

import { FETCH_RATED_DISABILITIES } from '../actions';

const initialState = {
  ratedDisabilities: null,
};

function ratedDisabilities(state = initialState, action) {
  switch (action.type) {
    case FETCH_RATED_DISABILITIES:
      return set('ratedDisabilities', action.ratedDisabilities, state);

    default:
      return state;
  }
}

export default {
  ratedDisabilities,
};
