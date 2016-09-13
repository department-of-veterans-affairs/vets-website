export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';
export const SET_RECIPIENT = 'SET_RECIPIENT';

export const FETCH_RECIPIENTS_SUCCESS = 'FETCH_RECIPIENTS_SUCCESS';
export const FETCH_RECIPIENTS_FAILURE = 'FETCH_RECIPIENTS_FAILURE';

const baseUri = 'http://mock-prescriptions-api.herokuapp.com/v0/messaging/health';

export function setCategory(field) {
  return {
    type: SET_CATEGORY,
    field
  };
}

export function setSubject(field) {
  return {
    type: SET_SUBJECT,
    field
  };
}

export function setRecipient(field) {
  return {
    type: SET_RECIPIENT,
    field
  };
}

export function fetchRecipients() {
  return dispatch => {
    fetch(`${baseUri}/recipients`)
    .then(res => res.json())
    .then(
      recipients => dispatch({ type: FETCH_RECIPIENTS_SUCCESS, recipients }),
      err => dispatch({ type: FETCH_RECIPIENTS_FAILURE, err })
    );
  };
}
