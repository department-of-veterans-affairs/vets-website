import set from 'platform/utilities/data/set';

import {
  CLEAR_NOTIFICATION,
  SET_NOTIFICATION,
  CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION,
  SET_ADDITIONAL_EVIDENCE_NOTIFICATION,
} from '../actions/types';

const initialState = {
  message: null,
  additionalEvidenceMessage: null,
};

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_NOTIFICATION:
      return set('message', action.message, state);
    case CLEAR_NOTIFICATION:
      return set('message', null, state);
    case SET_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return set('additionalEvidenceMessage', action.message, state);
    case CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return set('additionalEvidenceMessage', null, state);
    default:
      return state;
  }
}
