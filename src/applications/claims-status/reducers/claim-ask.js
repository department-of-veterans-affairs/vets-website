import { assign, set } from 'lodash';

import {
  SUBMIT_DECISION_REQUEST,
  SET_DECISION_REQUESTED,
  SET_DECISION_REQUEST_ERROR,
} from '../actions/index.jsx';

const initialState = {
  decisionRequested: false,
  loadingDecisionRequest: false,
  decisionRequestError: null,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_DECISION_REQUEST: {
      return set(state, 'loadingDecisionRequest', true);
    }
    case SET_DECISION_REQUESTED: {
      return assign(state, {
        decisionRequested: true,
        loadingDecisionRequest: false,
      });
    }
    case SET_DECISION_REQUEST_ERROR: {
      return assign(state, {
        decisionRequestError: action.error,
        loadingDecisionRequest: false,
      });
    }
    default:
      return state;
  }
}
