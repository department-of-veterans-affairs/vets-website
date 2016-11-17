import { apiRequest } from '../utils/helpers';

import {
  ADD_DRAFT_ATTACHMENTS,
  CLEAR_DRAFT,
  CREATE_FOLDER_FAILURE,
  CREATE_FOLDER_SUCCESS,
  DELETE_DRAFT_ATTACHMENT,
  DELETE_MESSAGE_FAILURE,
  DELETE_MESSAGE_SUCCESS,
  FETCH_THREAD_FAILURE,
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_MESSAGE_FAILURE,
  FETCH_THREAD_MESSAGE_SUCCESS,
  LOADING_THREAD,
  MOVE_MESSAGE_FAILURE,
  MOVE_MESSAGE_SUCCESS,
  SAVE_DRAFT_FAILURE,
  SAVE_DRAFT_SUCCESS,
  SEND_MESSAGE_FAILURE,
  SEND_MESSAGE_SUCCESS,
  TOGGLE_THREAD_FORM,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  TOGGLE_REPLY_DETAILS,
  UPDATE_DRAFT
} from '../utils/constants';

const baseUrl = '/messages';

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
    apiRequest(
      url,
      { method: 'DELETE' },
      () => dispatch({ type: DELETE_MESSAGE_SUCCESS }),
      () => dispatch({ type: DELETE_MESSAGE_FAILURE })
    );
  };
}

export function fetchThread(id) {
  const messageUrl = `${baseUrl}/${id}`;
  const threadUrl = `${messageUrl}/thread`;

  return dispatch => {
    dispatch({ type: LOADING_THREAD });

    Promise.all([messageUrl, threadUrl].map(url =>
      apiRequest(
        url,
        null,
        response => response,
        () => dispatch({ type: FETCH_THREAD_FAILURE })
      )
    )).then(
      data => dispatch({
        type: FETCH_THREAD_SUCCESS,
        message: data[0],
        thread: data[1].data
      })
    );
  };
}

export function fetchThreadMessage(id) {
  return dispatch => {
    const messageUrl = `${baseUrl}/${id}`;

    apiRequest(
      messageUrl,
      null,
      data => dispatch({
        type: FETCH_THREAD_MESSAGE_SUCCESS,
        message: data
      }),
      () => dispatch({ type: FETCH_THREAD_MESSAGE_FAILURE })
    );
  };
}

export function moveMessageToFolder(messageId, folder) {
  const folderId = folder.folderId;
  const url = `${baseUrl}/${messageId}/move?folder_id=${folderId}`;

  return dispatch => {
    apiRequest(
      url,
      { method: 'PATCH' },
      () => dispatch({ type: MOVE_MESSAGE_SUCCESS, folder }),
      () => dispatch({ type: MOVE_MESSAGE_FAILURE })
    );
  };
}

export function createFolderAndMoveMessage(folderName, messageId) {
  const foldersUrl = '/folders';
  const folderData = { folder: { name: folderName } };

  const settings = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(folderData)
  };

  return dispatch => {
    apiRequest(
      foldersUrl,
      settings,
      (data) => {
        const folder = data.data.attributes;
        dispatch({ type: CREATE_FOLDER_SUCCESS, folder, noAlert: true });
        return dispatch(moveMessageToFolder(messageId, folder));
      },
      () => dispatch({ type: CREATE_FOLDER_FAILURE })
    );
  };
}

export function saveDraft(message) {
  const draftsUrl = '/message_drafts';
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
  let method = 'POST';

  if (isReply) {
    url = `${url}/${message.replyMessageId}/replydraft`;
  }

  // Update the draft if it already has an id.
  // Save a new draft if it doesn't have an id yet.
  if (isSavedDraft) {
    url = `${url}/${message.messageId}`;
    method = 'PUT';
  }

  const settings = {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  return dispatch => {
    apiRequest(
      url,
      settings,
      (response) => {
        if (isSavedDraft) {
          return dispatch({ type: SAVE_DRAFT_SUCCESS, message });
        }

        return dispatch({
          type: SAVE_DRAFT_SUCCESS,
          message: response.data.attributes
        });
      },
      () => dispatch({ type: SAVE_DRAFT_FAILURE })
    );
  };
}

export function sendMessage(message) {
  let url = baseUrl;
  const payload = new FormData();
  const isReply = message.replyMessageId !== undefined;
  const isSavedDraft = message.messageId !== undefined;

  // Deletes draft (if it was saved) once message is successfully sent.
  if (isSavedDraft) {
    payload.append('message[draft_id]', message.messageId);
  }

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

  const settings = {
    method: 'POST',
    body: payload
  };

  return dispatch => {
    apiRequest(
      url,
      settings,
      response => dispatch({
        type: SEND_MESSAGE_SUCCESS,
        message: response.data.attributes
      }),
      () => dispatch({ type: SEND_MESSAGE_FAILURE })
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

export function toggleThreadForm() {
  return { type: TOGGLE_THREAD_FORM };
}

export function updateDraft(key, field) {
  return { type: UPDATE_DRAFT, key, field };
}

export function toggleMoveTo() {
  return { type: TOGGLE_MOVE_TO };
}
