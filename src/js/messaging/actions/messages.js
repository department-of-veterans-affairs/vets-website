import { apiUrl } from '../config';

export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';
export const SET_VISIBLE_DETAILS = 'SET_VISIBLE_DETAILS';

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
