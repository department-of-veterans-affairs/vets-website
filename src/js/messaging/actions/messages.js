import { apiUrl } from '../config';

export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';

const baseUrl = `${apiUrl}/messages`;

export function fetchThread(id = 12345) {
  return dispatch => {
    fetch(`${baseUrl}/${id}/thread`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_THREAD_SUCCESS, data }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}
