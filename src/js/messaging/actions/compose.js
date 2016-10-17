import { api } from '../config';

import {
  ADD_COMPOSE_ATTACHMENTS,
  DELETE_COMPOSE_ATTACHMENT,
  DELETE_COMPOSE_MESSAGE,
  FETCH_RECIPIENTS_SUCCESS,
  FETCH_RECIPIENTS_FAILURE,
  FETCH_SENDER_SUCCESS,
<<<<<<< 87f640df20dc12ebf01f73ab47f00cda657b55ac
  SET_MESSAGE_FIELD
=======
  RESET_MESSAGE_OBJECT,
  SET_MESSAGE_FIELD,
  UPDATE_COMPOSE_CHARACTER_COUNT
>>>>>>> Reset message object when user first visits Compose page.
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

export function resetMessage() {
  return {
    type: RESET_MESSAGE_OBJECT
  };
}
