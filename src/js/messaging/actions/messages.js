import { apiUrl } from '../config';

export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';
export const SET_VISIBLE_DETAILS = 'SET_VISIBLE_DETAILS';
export const TOGGLE_MESSAGES_COLLAPSED = 'TOGGLE_MESSAGES_COLLAPSED';
export const UPDATE_REPLY_CHARACTER_COUNT = 'UPDATE_REPLY_CHARACTER_COUNT';

const baseUrl = `${apiUrl}/messages`;

export function fetchThread(id) {
  return dispatch => {
    fetch(`${baseUrl}/${id}/thread`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_THREAD_SUCCESS, data }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}

export function setVisibleDetails(messageId) {
  return { type: SET_VISIBLE_DETAILS, messageId };
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
