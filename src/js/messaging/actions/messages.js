import { api } from '../config';

export const CLEAR_DRAFT = 'CLEAR_DRAFT';
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
export const UPDATE_DRAFT_BODY = 'UPDATE_DRAFT_BODY';
export const UPDATE_DRAFT_CHARACTER_COUNT = 'UPDATE_DRAFT_CHARACTER_COUNT';

const baseUrl = `${api.url}/messages`;

export function clearDraft() {
  return { type: CLEAR_DRAFT };
}

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
    const request = fetch(url, settings).then(response => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json().then(
          data => {
            if (data.errors) {
              return dispatch({
                type: SAVE_DRAFT_FAILURE,
                error: data.errors
              });
            }

            return dispatch({
              type: SAVE_DRAFT_SUCCESS,
              message: data.data.attributes
            });
          },
          error => dispatch({ type: SAVE_DRAFT_FAILURE, error })
        );
      } else if (response.ok && !isNewDraft) {
          return dispatch({ type: SAVE_DRAFT_SUCCESS, message });
      } else {
        return dispatch({ type: SAVE_DRAFT_FAILURE });
      }
    });
  };
}

export function sendMessage(message) {
  const payload = {
    message: {
      // Include id when API supports automatically deleting
      // the draft when sending a message.
      // id: message.messageId,
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
      data => {
        if (data.errors) {
          return dispatch({
            type: SEND_MESSAGE_FAILURE,
            error: data.errors
          });
        }

        return dispatch({
          type: SEND_MESSAGE_SUCCESS,
          message: data.data.attributes
        });
      },
      error => dispatch({ type: SEND_MESSAGE_FAILURE, error })
    );
  };
}

export function sendReply(message) {
  const replyUrl = `${baseUrl}/${message.replyMessageId}/reply`;
  const payload = { message: { body: message.body } };
  const settings = Object.assign({}, api.settings.post, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(replyUrl, settings)
    .then(response => {
      // Delete the draft (if it exists) once the reply is successfully sent.
      const isSavedDraft = message.messageId !== undefined;
      if (response.ok && isSavedDraft) {
        const messageUrl = `${baseUrl}/${message.messageId}`;
        fetch(messageUrl, api.settings.delete);
      }

      return response.json();
    }).then(
      data => {
        if (data.errors) {
          return dispatch({
            type: SEND_MESSAGE_FAILURE,
            error: data.errors
          });
        }

        return dispatch({
          type: SEND_MESSAGE_SUCCESS,
          message: data.data.attributes
        });
      },
      error => dispatch({ type: SEND_MESSAGE_FAILURE, error })
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

export function updateDraftBody(field) {
  return {
    type: UPDATE_DRAFT_BODY,
    field
  };
}

export function updateDraftCharacterCount(field, maxLength) {
  const chars = maxLength - field.value.length;
  return {
    type: UPDATE_DRAFT_CHARACTER_COUNT,
    chars
  };
}

export function toggleMoveTo() {
  return { type: TOGGLE_MOVE_TO };
}
