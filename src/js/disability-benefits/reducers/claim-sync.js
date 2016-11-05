import _ from 'lodash/fp';

import {
  SET_CLAIM_DETAIL,
  SET_CLAIMS,
  SET_UNAVAILABLE
} from '../actions';

const initialState = {
  synced: true,
  available: true
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL:
      return _.merge(state, {
        synced: action.meta.successfulSync,
        available: true
      });
    case SET_CLAIMS:
      return _.merge(state, {
        synced: action.meta.successfulSync,
        available: true
      });
    case SET_UNAVAILABLE:
      return _.set('available', false, state);
    default:
      return state;
  }
}
