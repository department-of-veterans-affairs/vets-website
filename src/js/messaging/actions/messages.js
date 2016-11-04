import { api } from '../config';
import { isJson } from '../utils/helpers';

import {
  ADD_DRAFT_ATTACHMENTS,
  CLEAR_DRAFT,
  CREATE_FOLDER_FAILURE,
  CREATE_FOLDER_SUCCESS,
  DELETE_DRAFT_ATTACHMENT,
  DELETE_MESSAGE_SUCCESS,
  DELETE_MESSAGE_FAILURE,
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_FAILURE,
  MOVE_MESSAGE_SUCCESS,
  MOVE_MESSAGE_FAILURE,
  SAVE_DRAFT_SUCCESS,
  SAVE_DRAFT_FAILURE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  TOGGLE_REPLY_DETAILS,
  UPDATE_DRAFT
} from '../utils/constants';

const baseUrl = `${api.url}/messages`;

export function addDraftAttachments(files) {
  return { type: ADD_DRAFT_ATTACHMENTS, files };
}

export function clearDraft() {
  return { type: CLEAR_DRAFT };
}

export function deleteDraftAttachment(index) {
  return { type: DELETE_DRAFT_ATTACHMENT, index };
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
        message: data[0],
        thread: data[1].data
      }),
      err => dispatch({ type: FETCH_THREAD_FAILURE, err })
    );
  };
}

export function moveMessageToFolder(messageId, folder) {
  const folderId = folder.folderId;
  const url = `${baseUrl}/${messageId}/move?folder_id=${folderId}`;
  return dispatch => {
    fetch(url, api.settings.patch)
    .then(response => {
      const action = response.ok
                   ? { type: MOVE_MESSAGE_SUCCESS, folder }
                   : { type: MOVE_MESSAGE_FAILURE };

      return dispatch(action);
    });
  };
}

export function createFolderAndMoveMessage(folderName, messageId) {
  const foldersUrl = `${api.url}/folders`;
  const folderData = { folder: { name: folderName } };
  const settings = Object.assign({}, api.settings.postJson, {
    body: JSON.stringify(folderData)
  });

  return dispatch => {
    fetch(foldersUrl, settings)
    .then(response => {
      if (!response.ok) {
        return dispatch({ type: CREATE_FOLDER_FAILURE });
      }

      return response.json().then(
        data => {
          const folder = data.data.attributes;
          dispatch({ type: CREATE_FOLDER_SUCCESS, folder, noAlert: true });
          return dispatch(moveMessageToFolder(messageId, folder));
        },
        error => dispatch({ type: MOVE_MESSAGE_FAILURE, error })
      );
    });
  };
}

export function saveDraft(message) {
  const draftsUrl = `${api.url}/message_drafts`;
  const payload = {
    messageDraft: {
      body: message.body,
      category: message.category,
      recipientId: message.recipientId,
      subject: message.subject
    }
  };

  const isReply = message.replyMessageId !== undefined;
  const isSavedDraft = message.messageId !== undefined;
  let url = draftsUrl;
  let defaultSettings = api.settings.postJson;

  if (isReply) {
    url = `${url}/${message.replyMessageId}/replydraft`;
  }

  // Update the draft if it already has an id.
  // Save a new draft if it doesn't have an id yet.
  if (isSavedDraft) {
    url = `${url}/${message.messageId}`;
    defaultSettings = api.settings.put;
  }

  const settings = Object.assign({}, defaultSettings, {
    body: JSON.stringify(payload)
  });

  return dispatch => {
    fetch(url, settings).then(response => {
      if (isJson(response)) {
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
      } else if (response.ok && isSavedDraft) {
        return dispatch({ type: SAVE_DRAFT_SUCCESS, message });
      }
      return dispatch({ type: SAVE_DRAFT_FAILURE });
    });
  };
}

export function sendMessage(message) {
  const payload = new FormData();
  const isReply = message.replyMessageId !== undefined;
  let url = baseUrl;

  if (isReply) {
    url = `${url}/${message.replyMessageId}/reply`;
  } else {
    payload.append('message[recipient_id]', message.recipientId);
    payload.append('message[category]', message.category);
    payload.append('message[subject]', message.subject);
  }

  payload.append('message[body]', message.body);

  // Add each attachment as a separate item
  message.attachments.forEach((file) => {
    payload.append('uploads[]', file);
  });

  const settings = Object.assign({}, api.settings.postFormData, {
    body: payload
  });

  return dispatch => {
    fetch(url, settings)
    .then(response => {
      // If the message has an id, it was a saved draft.
      // Delete the draft once message is successfully sent.
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
  return { type: TOGGLE_MESSAGE_COLLAPSED, messageId };
}

export function toggleMessagesCollapsed() {
  return { type: TOGGLE_MESSAGES_COLLAPSED };
}

export function toggleReplyDetails() {
  return { type: TOGGLE_REPLY_DETAILS };
}

export function updateDraft(key, field) {
  return { type: UPDATE_DRAFT, key, field };
}

export function toggleMoveTo() {
  return { type: TOGGLE_MOVE_TO };
}
