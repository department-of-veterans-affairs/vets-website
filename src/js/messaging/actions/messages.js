export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';

const baseUri = 'http://mock-prescriptions-api.herokuapp.com/v0/messaging/health/messages';

export function fetchThread(id = 12345) {
  return dispatch => {
    fetch(`${baseUri}/${id}/thread`)
    .then(res => res.json())
    .then(
      data => dispatch({ type: FETCH_THREAD_SUCCESS, data }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}
