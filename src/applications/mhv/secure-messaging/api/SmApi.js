import environment from 'platform/utilities/environment';
import { apiRequest } from 'platform/utilities/api';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * Gets the folder list for the current user.
 * @returns
 */
export const getFolderList = () => {
  return apiRequest(`${apiBasePath}/messaging/folders`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Gets a single folder.
 * @param {Long} folderId
 * @returns
 */
export const getFolder = folderId => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Create a folder.
 * @param {String} folderName
 * @returns
 */
export const createFolder = folderName => {
  return apiRequest(`${apiBasePath}/messaging/folders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: { name: folderName },
  });
};

/**
 * Delete a folder.
 * @param {Long} folderId
 * @returns
 */
export const deleteFolder = folderId => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}`, {
    method: 'DEL',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get a list of all message categories.
 * @returns
 */
export const getMessageCategoryList = () => {
  return apiRequest(`${apiBasePath}/messaging/messages/categories`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

/**
 * Get the list of messages in the specified folder.
 * @param {Long} folderId
 * @returns
 */
export const getMessageList = folderId => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}/messages`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get a single message.
 * @param {Long} messageId
 * @returns
 */
export const getMessage = messageId => {
  return apiRequest(`${apiBasePath}/messaging/messages/${messageId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get a single attachment
 * @param {Long} messageId
 * @param {Long} attachmentId
 * @returns
 */
export const getAttachment = (messageId, attachmentId) => {
  return apiRequest(
    `${apiBasePath}/messaging/messages/${messageId}/attachments/${attachmentId}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

/**
 * Create a draft message.
 * @param {*} message
 * @returns
 */
export const createDraft = message => {
  return apiRequest(`${apiBasePath}/messaging/message_drafts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(message),
  });
};

/**
 * Update a draft message.
 * @param {*} draftMessageId
 * @param {Long} message
 * @returns
 */
export const updateDraft = (draftMessageId, message) => {
  return apiRequest(
    `${apiBasePath}/messaging/message_drafts/${draftMessageId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    },
  );
};

/**
 * Create a "reply to" draft message.
 * @param {Long} replyToId
 * @param {*} message
 * @returns
 */
export const createReplyDraft = (replyToId, message) => {
  return apiRequest(
    `${apiBasePath}/messaging/message_drafts/${replyToId}/replydraft`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: message,
    },
  );
};

/**
 * Update a "reply to" draft message.
 * @param {Long} replyToId
 * @param {Long} draftMessageId
 * @param {*} message
 * @returns
 */
export const updateReplyDraft = (replyToId, draftMessageId, message) => {
  return apiRequest(
    `${apiBasePath}/messaging/message_drafts/${replyToId}/replydraft/${draftMessageId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: message,
    },
  );
};

/**
 * Create a new message.
 * @param {*} message
 * @returns
 */
export const createMessage = message => {
  return apiRequest(`${apiBasePath}/messaging/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: message,
  });
};

/**
 * Create a new "reply to" message.
 * @param {*} message
 * @returns
 */
export const createReplyToMessage = message => {
  return apiRequest(`${apiBasePath}/messaging/messages/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: message,
  });
};

/**
 * Delete a message.
 * @param {Long} messageId
 * @returns
 */
export const deleteMessage = messageId => {
  return apiRequest(`${apiBasePath}/messaging/messages/${messageId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'DELETE',
  });
};

/**
 * Get message history.
 * @param {Long} messageId
 * @returns
 */
export const getMessageHistory = messageId => {
  return apiRequest(`${apiBasePath}/messaging/messages/${messageId}/thread`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Move a message.
 * @param {Long} messageId
 * @param {Long} toFolderId
 * @returns
 */
export const moveMessage = (messageId, toFolderId) => {
  return apiRequest(
    `${apiBasePath}/messaging/messages/${messageId}/move/${toFolderId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

/**
 * Get a list of triage teams.
 * @returns
 */
export const getTriageTeamList = () => {
  return apiRequest(`${apiBasePath}/messaging/recipients`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
