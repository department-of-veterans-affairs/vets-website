import set from 'platform/utilities/data/set';

import {
  SUBMIT_DECISION_REQUEST,
  SET_DECISION_REQUESTED,
  SET_DECISION_REQUEST_ERROR,
} from '../actions/types';

const initialState = {
  decisionRequested: false,
  loadingDecisionRequest: false,
  decisionRequestError: null,
};

export default function claimDetailReducer(state = initialState, action) {
  switch (action.type) {
    case SUBMIT_DECISION_REQUEST: {
      return set('loadingDecisionRequest', true, state);
    }
    case SET_DECISION_REQUESTED: {
      return {
        ...state,
        decisionRequested: true,
        loadingDecisionRequest: false,
      };
    }
    case SET_DECISION_REQUEST_ERROR: {
      return {
        ...state,
        decisionRequestError: action.error,
        loadingDecisionRequest: false,
      };
    }
    default:
      return state;
  }
}
