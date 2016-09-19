import { apiUrl } from '../config';

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';
export const SET_RECIPIENT = 'SET_RECIPIENT';
export const SET_SUBJECT_REQUIRED = 'SET_SUBJECT_REQUIRED';

export const FETCH_RECIPIENTS_SUCCESS = 'FETCH_RECIPIENTS_SUCCESS';
export const FETCH_RECIPIENTS_FAILURE = 'FETCH_RECIPIENTS_FAILURE';
export const FETCH_SENDER_SUCCESS = 'FETCH_SENDER_SUCCESS';

export const SAVE_MESSAGE = 'SAVE_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';

export const DELETE_DRAFT = 'DELETE_DRAFT';
export const SET_MESSAGE_FIELD = 'SET_MESSAGE_FIELD';

const baseUrl = `${apiUrl}/recipients`;

export function setMessageField(path, field) {
  return {
    type: SET_MESSAGE_FIELD,
    path,
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

export function fetchSenderName() {
  /*
  TODO: Make this conduct an actual
  fetch operation for this data
  */
  return {
    type: FETCH_SENDER_SUCCESS,
    sender: {
      lastName: 'Veteran',
      firstName: 'Jane',
      middleName: 'Q.'
    }
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

