import set from 'lodash/fp/set';

import {
  SET_CATEGORY,
  SET_RECIPIENT,
  SET_SUBJECT,
  SET_SUBJECT_REQUIRED,
  SEND_MESSAGE,
  SAVE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_RECIPIENTS_FAILURE
} from '../actions/compose';

const initialState = {
  message: {
    category: undefined,
    recipient: undefined,
    subject: {
      value: undefined,
      required: false
    }
  },
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
      value: item.attributes.triage_team_id
    };
  });
}

export default function compose(state = initialState, action) {
  switch (action.type) {
    case SET_CATEGORY:
      return set('message.category', action.field.value, state);
    case SET_SUBJECT:
      return set('message.subject.value', action.field.value, state);
    case SET_SUBJECT_REQUIRED:
      return set('message.subject.required', action.fieldState.required, state);
    case SET_RECIPIENT:
      return set('message.recipient', action.field.value, state);
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', getRecipients(action.recipients.data), state);
    case FETCH_RECIPIENTS_FAILURE:
    case SEND_MESSAGE:
      // TODO: Make this post to the send message endpoint
      // instead
      return state;
    case SAVE_MESSAGE:
      // TODO: Make this post to the save message endpoint
      // instead
      return state;
    default:
      return state;
  }
}
