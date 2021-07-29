import set from 'lodash/set';

import {
  CLEAR_NOTIFICATION,
  SET_NOTIFICATION,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
} from '../actions/index.jsx';

const initialState = {
  message: null,
  additionalEvidenceMessage: null,
};

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return set(state, 'message', action.message);
    case CLEAR_NOTIFICATION:
      return set(state, 'message', null);
    case SET_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return set(state, 'additionalEvidenceMessage', action.message);
    case CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return set(state, 'additionalEvidenceMessage', null);
    default:
      return state;
  }
}
