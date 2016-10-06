import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';
import { composeMessage } from '../config';

import {
  SET_MESSAGE_FIELD,
  SET_ATTACHMENTS,
  DELETE_ATTACHMENT,
  DELETE_COMPOSE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_SENDER_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  UPDATE_COMPOSE_CHARACTER_COUNT
} from '../actions/compose';

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

export default function compose(state = initialState, action) {
  switch (action.type) {
    case DELETE_ATTACHMENT:
      // Remove the attachment at the requested index.
      state.message.attachments.splice(action.index, 1);
      return set('message.attachments', state.message.attachments, state);
    case DELETE_COMPOSE_MESSAGE:
      return initialState;
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', getRecipients(action.recipients.data), state);
    case FETCH_SENDER_SUCCESS:
      return set('message.sender', action.sender, state);
    case SET_MESSAGE_FIELD:
      return set(action.path, action.field, state);
    case SET_ATTACHMENTS:
      return set('message.attachments', action.files, state);
    case UPDATE_COMPOSE_CHARACTER_COUNT:
      return set('message.charsRemaining', action.chars, state);
    case FETCH_RECIPIENTS_FAILURE:
    default:
      return state;
  }
}
