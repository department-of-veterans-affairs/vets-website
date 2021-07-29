import { assign, set } from 'lodash';

import {
  SET_CLAIM_DETAIL,
  SET_CLAIMS,
  SET_CLAIMS_UNAVAILABLE,
  SET_UNAUTHORIZED,
} from '../actions/index.jsx';

const initialState = {
  synced: true,
  available: true,
  authorized: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL:
    case SET_CLAIMS:
      return assign(state, {
        synced: action.meta.syncStatus === 'SUCCESS',
        available: true,
        authorized: true,
      });
    case SET_CLAIMS_UNAVAILABLE:
      return set(state, 'available', false);
    case SET_UNAUTHORIZED:
      return set(state, 'authorized', false);
    default:
      return state;
  }
}
