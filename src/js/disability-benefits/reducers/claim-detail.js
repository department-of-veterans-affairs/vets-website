import _ from 'lodash/fp';

import {
  GET_CLAIM_DETAIL,
  SET_CLAIM_DETAIL,
  SUBMIT_DECISION_REQUEST,
  SET_DECISION_REQUEST
} from '../actions';

const initialState = {
  detail: null,
  loading: true,
  decisionRequested: false,
  loadingDecisionRequest: false
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
    case SUBMIT_DECISION_REQUEST: {
      return _.set('loadingDecisionRequest', true, state);
    }
    case SET_DECISION_REQUEST: {
      return _.set('decisionRequested', true, state);
    }
    default:
      return state;
  }
}
