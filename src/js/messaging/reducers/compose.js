import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';
import { composeMessage } from '../config';

import {
  ADD_COMPOSE_ATTACHMENTS,
  DELETE_COMPOSE_ATTACHMENT,
  DELETE_COMPOSE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_SENDER_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  RESET_MESSAGE_OBJECT,
  SET_MESSAGE_FIELD,
  UPDATE_COMPOSE_CHARACTER_COUNT
} from '../utils/constants';

const initialState = {
  message: {
    sender: {
      firstName: '',
      lastName: '',
      middleName: ''
    },
    category: makeField(''),
    recipient: makeField(''),
    subject: makeField(''),
    text: makeField(''),
    charsRemaining: composeMessage.maxChars.message,
    attachments: []
  },
  // List of potential recipients
  recipients: []
};

/*
* Take the recipients object returned during the fetch operation
* and one return {label, value} object for each object in the
* action.recipients.data array.
* That's all we need.
*/
function getRecipients(recipients) {
  return recipients.map((item) => {
    return {
      label: item.attributes.name,
      value: item.attributes.triageTeamId
    };
  });
}

const resetMessage = (state) => {
  let msg = set('message.category', initialState.message.category, state);
  msg = set('message.recipient', initialState.message.recipient, msg);
  msg = set('message.subject', initialState.message.subject, msg);
  msg = set('message.attachments', initialState.message.attachments, msg);
  msg = set('message.text', initialState.message.text, msg);
  return msg;
};

export default function compose(state = initialState, action) {
  switch (action.type) {
    case ADD_COMPOSE_ATTACHMENTS:
      return set('message.attachments', [
        ...state.message.attachments,
        ...action.files
      ], state);
    case DELETE_COMPOSE_ATTACHMENT:
      // Remove the attachment at the requested index.
      state.message.attachments.splice(action.index, 1);
      return set('message.attachments', state.message.attachments, state);
    case DELETE_COMPOSE_MESSAGE:
      return initialState;
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', getRecipients(action.recipients.data), state);
    case FETCH_SENDER_SUCCESS:
      return set('message.sender', action.sender, state);
    case RESET_MESSAGE_OBJECT:
      return resetMessage(state);
    case SET_MESSAGE_FIELD:
      return set(action.path, action.field, state);
    case UPDATE_COMPOSE_CHARACTER_COUNT:
      return set('message.charsRemaining', action.chars, state);
    case FETCH_RECIPIENTS_FAILURE:
    default:
      return state;
  }
}
