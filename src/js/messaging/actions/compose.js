import { api } from '../config';

import {
  ADD_COMPOSE_ATTACHMENTS,
  DELETE_COMPOSE_ATTACHMENT,
  DELETE_COMPOSE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  RESET_MESSAGE_OBJECT,
  SET_MESSAGE_FIELD,
} from '../utils/constants';

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

export function addComposeAttachments(files) {
  return {
    type: ADD_COMPOSE_ATTACHMENTS,
    files
  };
}

export function deleteComposeAttachment(index) {
  return {
    type: DELETE_COMPOSE_ATTACHMENT,
    index
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

export function resetMessage() {
  return {
    type: RESET_MESSAGE_OBJECT
  };
}
