import _ from 'lodash/fp';

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
      return _.set('message', action.message, state);
    case CLEAR_NOTIFICATION:
      return _.set('message', null, state);
    case SET_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return _.set('additionalEvidenceMessage', action.message, state);
    case CLEAR_ADDITIONAL_EVIDENCE_NOTIFICATION:
      return _.set('additionalEvidenceMessage', null, state);
    default:
      return state;
  }
}
