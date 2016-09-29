import { api } from '../config';

export const DELETE_REPLY = 'DELETE_REPLY';
export const DELETE_MESSAGE_SUCCESS = 'DELETE_MESSAGE_SUCCESS';
export const DELETE_MESSAGE_FAILURE = 'DELETE_MESSAGE_FAILURE';
export const FETCH_THREAD_SUCCESS = 'FETCH_THREAD_SUCCESS';
export const FETCH_THREAD_FAILURE = 'FETCH_THREAD_FAILURE';
export const SAVE_DRAFT_SUCCESS = 'SAVE_DRAFT_SUCCESS';
export const SAVE_DRAFT_FAILURE = 'SAVE_DRAFT_FAILURE';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const TOGGLE_MESSAGE_COLLAPSED = 'TOGGLE_MESSAGE_COLLAPSED';
export const TOGGLE_MESSAGES_COLLAPSED = 'TOGGLE_MESSAGES_COLLAPSED';
export const TOGGLE_MOVE_TO = 'TOGGLE_MOVE_TO';
export const UPDATE_REPLY_BODY = 'UPDATE_REPLY_BODY';
export const UPDATE_REPLY_CHARACTER_COUNT = 'UPDATE_REPLY_CHARACTER_COUNT';

const baseUrl = `${api.url}/messages`;

export function deleteMessage(id) {
  const url = `${baseUrl}/${id}`;

  return dispatch => {
    fetch(url, api.settings.delete)
    .then(response => {
      const action = response.ok
                   ? { type: DELETE_MESSAGE_SUCCESS }
                   : { type: DELETE_MESSAGE_FAILURE };

      return dispatch(action);
    });
  };
}

export function deleteReply() {
  return { type: DELETE_REPLY };
}

export function fetchThread(id) {
  const messageUrl = `${baseUrl}/${id}`;
  const threadUrl = `${messageUrl}/thread`;

  return dispatch => {
    Promise.all([messageUrl, threadUrl].map(url =>
      fetch(url, api.settings.get).then(res => res.json())
    )).then(
      data => dispatch({
        type: FETCH_THREAD_SUCCESS,
        message: data[0].data,
        thread: data[1].data
      }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}

export function saveDraft(message) {
  const draftsUrl = `${api.url}/message_drafts`;
  const payload = {
    messageDraft: {
      category: message.category,
      subject: message.subject,
      body: message.body,
      recipientId: message.recipientId
    }
  };

  // Save the message as a new draft if it doesn't have an id yet.
  // Update the draft if it does have an id.
  const isNewDraft = message.messageId === undefined;

  const url = isNewDraft
            ? draftsUrl
            : `${draftsUrl}/${message.messageId}`;

  const defaultSettings = isNewDraft
                        ? api.settings.post
                        : api.settings.put;

  const settings = Object.assign({}, defaultSettings, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(url, settings)
    .then(res => res.json())
    .then(
      data => {
        let action = { type: SAVE_DRAFT_SUCCESS, data };

        if (data.errors) {
          action = {
            type: SAVE_DRAFT_FAILURE,
            errors: data.errors
          };
        }

        return dispatch(action);
      },
      err => dispatch({ type: SAVE_DRAFT_FAILURE, err })
    );
  };
}

export function sendMessage(message) {
  const payload = {
    message: {
      category: message.category,
      subject: message.subject,
      body: message.body,
      recipientId: message.recipientId
    }
  };

  const settings = Object.assign({}, api.settings.post, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(baseUrl, settings)
    .then(res => res.json())
    .then(
      data => dispatch({ type: SEND_MESSAGE_SUCCESS, data }),
      err => dispatch({ type: SEND_MESSAGE_FAILURE, err })
    );
  };
}

export function toggleMessageCollapsed(messageId) {
  return {
    type: TOGGLE_MESSAGE_COLLAPSED,
    messageId
  };
}

export function toggleMessagesCollapsed() {
  return { type: TOGGLE_MESSAGES_COLLAPSED };
}

export function updateReplyBody(field) {
  return {
    type: UPDATE_REPLY_BODY,
    field
  };
}

export function updateReplyCharacterCount(field, maxLength) {
  const chars = maxLength - field.value.length;
  return {
    type: UPDATE_REPLY_CHARACTER_COUNT,
    chars
  };
}

export function toggleMoveTo() {
  return { type: TOGGLE_MOVE_TO };
}
