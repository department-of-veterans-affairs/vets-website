import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';
import { composeMessage } from '../config';

import {
  SET_MESSAGE_FIELD,
  SAVE_MESSAGE,
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
    case DELETE_COMPOSE_MESSAGE:
      return initialState;
    case SET_MESSAGE_FIELD:
      return set(action.path, action.field, state);
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', getRecipients(action.recipients.data), state);
    case FETCH_SENDER_SUCCESS:
      return set('message.sender', action.sender, state);
    case UPDATE_COMPOSE_CHARACTER_COUNT:
      return set('message.charsRemaining', action.chars, state);
    case FETCH_RECIPIENTS_FAILURE:
    case SAVE_MESSAGE:
    default:
      return state;
  }
}
