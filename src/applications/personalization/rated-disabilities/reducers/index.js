import set from 'platform/utilities/data/set';

import {
  FETCH_RATED_DISABILITIES_SUCCESS,
  FETCH_RATED_DISABILITIES_FAILED,
  FETCH_TOTAL_DISABILITY_RATING_SUCCESS,
  FETCH_TOTAL_DISABILITY_RATING_FAILED,
} from '../actions';

const initialState = {
  ratedDisabilities: null,
  totalDisabilityRating: null,
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

function getTotalDisabilityRating(state = initialState, action) {
  console.log('the initial state is ' + initialState.totalDisabilityRating);
  switch (action.type) {
    case FETCH_TOTAL_DISABILITY_RATING_SUCCESS:
      console.log('getTotalDisabilityRating success');
      return state;
      return set('totalDisabilityRating', action.num, state);

    case FETCH_TOTAL_DISABILITY_RATING_FAILED:
      console.log('getTotalDisabilityRating failed');
      return state;
      return set('totalDisabilityRating', action.num, state);

    default:
      return state;
  }
}

export default {
  ratedDisabilities,
  getTotalDisabilityRating,
};
