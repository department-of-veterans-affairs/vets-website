import { api } from '../config';

export const SET_CATEGORY = 'SET_CATEGORY';
export const SET_SUBJECT = 'SET_SUBJECT';
export const SET_RECIPIENT = 'SET_RECIPIENT';

export const DELETE_COMPOSE_MESSAGE = 'DELETE_COMPOSE_MESSAGE';

export const FETCH_RECIPIENTS_SUCCESS = 'FETCH_RECIPIENTS_SUCCESS';
export const FETCH_RECIPIENTS_FAILURE = 'FETCH_RECIPIENTS_FAILURE';
export const FETCH_SENDER_SUCCESS = 'FETCH_SENDER_SUCCESS';

export const SAVE_MESSAGE = 'SAVE_MESSAGE';

export const DELETE_DRAFT = 'DELETE_DRAFT';
export const SET_MESSAGE_FIELD = 'SET_MESSAGE_FIELD';
export const UPDATE_COMPOSE_CHARACTER_COUNT = 'UPDATE_COMPOSE_CHARACTER_COUNT';

export function deleteComposeMessage() {
  return { type: DELETE_COMPOSE_MESSAGE };
}

export function setMessageField(path, field) {
  return {
    type: SET_MESSAGE_FIELD,
    path,
    field
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
  const url = `${api.url}/recipients`;
  return dispatch => {
    fetch(url, api.settings.get)
    .then(res => res.json())
    .then(
      recipients => dispatch({ type: FETCH_RECIPIENTS_SUCCESS, recipients }),
      err => dispatch({ type: FETCH_RECIPIENTS_FAILURE, err })
    );
  };
}

export function updateComposeCharacterCount(field, maxLength) {
  const chars = maxLength - field.value.length;
  return {
    type: UPDATE_COMPOSE_CHARACTER_COUNT,
    chars
  };
}
