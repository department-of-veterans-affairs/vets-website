import { api } from '../config';

export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';
export const SET_VISIBLE_DETAILS = 'SET_VISIBLE_DETAILS';
export const TOGGLE_MESSAGE_COLLAPSED = 'TOGGLE_MESSAGE_COLLAPSED';
export const TOGGLE_MESSAGES_COLLAPSED = 'TOGGLE_MESSAGES_COLLAPSED';
export const TOGGLE_MOVE_TO = 'TOGGLE_MOVE_TO';
export const UPDATE_REPLY_CHARACTER_COUNT = 'UPDATE_REPLY_CHARACTER_COUNT';

const baseUrl = `${api.url}/messages`;

export function fetchThread(id) {
  const messageUrl = `${baseUrl}/${id}`;
  const threadUrl = `${messageUrl}/thread`;

  return dispatch => {
    Promise.all([messageUrl, threadUrl].map(url =>
      fetch(url, api.settings).then(res => res.json())
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

export function setVisibleDetails(messageId) {
  return { type: SET_VISIBLE_DETAILS, messageId };
}

export function toggleMessageCollapsed(messageId) {
  return { type: TOGGLE_MESSAGE_COLLAPSED, messageId };
}

export function toggleMessagesCollapsed() {
  return { type: TOGGLE_MESSAGES_COLLAPSED };
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
