import set from 'lodash/fp/set';

import {
  CONFIRM_DELETE_MODAL,
  SET_MESSAGE,
  SET_SUBJECT_REQUIRED,
  SEND_MESSAGE,
  SAVE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_SENDER_SUCCESS,
  FETCH_RECIPIENTS_FAILURE
} from '../actions/compose';

const initialState = {
  message: {
    sender: {
      firstName: '',
      lastName: '',
      middleName: ''
    },
    category: undefined,
    recipient: undefined,
    subject: {
      value: undefined,
      required: false
    },
    text: undefined,
    attachments: []
  },
  modals: {
    deleteconfirm: {
      visible: false
    }
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
      value: item.attributes.triage_team_id
    };
  });
}

export default function compose(state = initialState, action) {
  switch (action.type) {
    case SET_MESSAGE:
      return set(action.path, action.field.value, state);
    case SET_SUBJECT_REQUIRED:
      return set('message.subject.required', action.fieldState.required, state);
    case FETCH_RECIPIENTS_SUCCESS:
      return set('recipients', getRecipients(action.recipients.data), state);
    case FETCH_SENDER_SUCCESS:
      return set('message.sender', action.sender, state);
    case SHOW_CONFIRM_DELETE:
      return set('modals.deleteconfirm.visible', !state.modals.deleteconfirm.visible, state);
    case FETCH_RECIPIENTS_FAILURE:
    case SEND_MESSAGE:
    case SAVE_MESSAGE:
    default:
      return state;
  }
}
