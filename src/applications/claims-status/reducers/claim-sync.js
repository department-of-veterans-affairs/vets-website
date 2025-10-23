import set from 'platform/utilities/data/set';

import {
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
  SET_UNAUTHORIZED,
} from '../actions/types';

const initialState = {
  available: true,
  authorized: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL:
      return {
        ...state,
        available: true,
        authorized: true,
      };
    case SET_CLAIMS_UNAVAILABLE:
      return set('available', false, state);
    case SET_UNAUTHORIZED:
      return set('authorized', false, state);
    default:
      return state;
  }
}
