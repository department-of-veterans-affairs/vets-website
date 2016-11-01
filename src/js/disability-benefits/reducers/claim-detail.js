import _ from 'lodash/fp';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
} from '../actions';

const initialState = {
  detail: null,
  loading: true
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CLAIM_DETAIL: {
      return _.merge(state, {
        detail: action.claim,
        loading: false
      });
    }
    case GET_CLAIM_DETAIL: {
      return _.set('loading', true, state);
    }
    default:
      return state;
  }
}
