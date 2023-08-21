import set from 'platform/utilities/data/set';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
} from '../actions/types';
import { serializeClaim } from './serialize';

const initialState = {
  detail: null,
  loading: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL: {
      return {
        ...state,
        detail: serializeClaim(action.claim),
        loading: false,
      };
    }
    case GET_CLAIM_DETAIL: {
      return set('loading', true, state);
    }
    case SET_CLAIMS_UNAVAILABLE: {
      return {
        ...state,
        detail: null,
        loading: false,
      };
    }
    default:
      return state;
  }
}
