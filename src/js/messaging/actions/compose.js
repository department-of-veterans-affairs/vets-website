import { apiUrl } from '../config';

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';
export const SET_RECIPIENT = 'SET_RECIPIENT';
export const SET_SUBJECT_REQUIRED = 'SET_SUBJECT_REQUIRED';

export const FETCH_RECIPIENTS_SUCCESS = 'FETCH_RECIPIENTS_SUCCESS';
export const FETCH_RECIPIENTS_FAILURE = 'FETCH_RECIPIENTS_FAILURE';

export const SAVE_MESSAGE = 'SAVE_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

const baseUrl = `${apiUrl}/recipients`;

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

export function setSubjectRequired(field) {
  const fieldState = field;
  fieldState.required = field.value === 'Other';

  return {
    type: SET_SUBJECT_REQUIRED,
    fieldState
  };
}

export function setRecipient(field) {
  return {
    type: SET_RECIPIENT,
    field
  };
}

export function sendMessage() {
  return {
    type: SEND_MESSAGE
  };
}

export function saveMessage() {
  return {
    type: SAVE_MESSAGE
  };
}

export function fetchRecipients() {
  return dispatch => {
    fetch(baseUrl)
    .then(res => res.json())
    .then(
      recipients => dispatch({ type: FETCH_RECIPIENTS_SUCCESS, recipients }),
      err => dispatch({ type: FETCH_RECIPIENTS_FAILURE, err })
    );
  };
}
