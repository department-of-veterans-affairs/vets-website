import _ from 'lodash/fp';

import {
  SET_CLAIM_DETAIL,
  SET_CLAIMS,
  SET_UNAVAILABLE
} from '../actions';

const initialState = {
  synced: true,
  syncedDate: null,
  available: true
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL:
      return _.merge(state, {
        synced: action.claim.attributes.successfulSync,
        syncedDate: action.claim.attributes.updatedAt,
        available: true
      });
    case SET_CLAIMS:
      if (action.claims.length) {
        return _.merge(state, {
          synced: action.claims[0].attributes.successfulSync,
          syncedDate: action.claims[0].attributes.updatedAt,
          available: true
        });
      }

      return state;
    case SET_UNAVAILABLE:
      return _.set('available', false, state);
    default:
      return state;
  }
}

