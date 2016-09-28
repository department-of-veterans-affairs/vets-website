import { api } from '../config';

export const DELETE_REPLY = 'DELETE_REPLY';
export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const TOGGLE_MESSAGE_COLLAPSED = 'TOGGLE_MESSAGE_COLLAPSED';
export const TOGGLE_MESSAGES_COLLAPSED = 'TOGGLE_MESSAGES_COLLAPSED';
export const TOGGLE_MOVE_TO = 'TOGGLE_MOVE_TO';
export const UPDATE_REPLY_BODY = 'UPDATE_REPLY_BODY';
export const UPDATE_REPLY_CHARACTER_COUNT = 'UPDATE_REPLY_CHARACTER_COUNT';

const baseUrl = `${api.url}/messages`;

export function deleteReply() {
  return { type: DELETE_REPLY };
}

export function fetchThread(id) {
  const messageUrl = `${baseUrl}/${id}`;
  const threadUrl = `${messageUrl}/thread`;

  return dispatch => {
    Promise.all([messageUrl, threadUrl].map(url =>
      fetch(url, api.settings.get).then(res => res.json())
    )).then(
      data => dispatch({
        type: FETCH_THREAD_SUCCESS,
        message: data[0].data,
        thread: data[1].data
      }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}

export function sendMessage(message) {
  const payload = {
    message: {
      category: message.category.value,
      subject: message.subject.value,
      body: message.text.value,
      recipientId: +message.recipient.value
    }
  };

  const settings = Object.assign({}, api.settings.post, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(baseUrl, settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: SEND_MESSAGE_SUCCESS, data }),
      err => dispatch({ type: SEND_MESSAGE_FAILURE, err })
    );
  };
}

export function toggleMessageCollapsed(messageId) {
  return {
    type: TOGGLE_MESSAGE_COLLAPSED,
    messageId
  };
}

export function toggleMessagesCollapsed() {
  return { type: TOGGLE_MESSAGES_COLLAPSED };
}

export function updateReplyBody(field) {
  return {
    type: UPDATE_REPLY_BODY,
    field
  };
}

export function updateReplyCharacterCount(field, maxLength) {
  const chars = maxLength - field.value.length;
  return {
    type: UPDATE_REPLY_CHARACTER_COUNT,
    chars
  };
}

export function toggleMoveTo() {
  return { type: TOGGLE_MOVE_TO };
}
