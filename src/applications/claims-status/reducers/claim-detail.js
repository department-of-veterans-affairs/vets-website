import { assign, set } from 'lodash';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SET_CLAIMS_UNAVAILABLE,
} from '../actions/index.jsx';

const initialState = {
  detail: null,
  loading: true,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL: {
      return assign(state, {
        detail: action.claim,
        loading: false,
      });
    }
    case GET_CLAIM_DETAIL: {
      return set(state, 'loading', true);
    }
    case SET_CLAIMS_UNAVAILABLE: {
      return set(state, {
        detail: null,
        loading: false,
      });
    }
    default:
      return state;
  }
}
