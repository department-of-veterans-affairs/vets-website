import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import { DefaultFolders, threadSortingOptions } from '../util/constants';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

/**
 * Gets the folder list for the current user.
 * @returns
 */
export const getFolderList = () => {
  const path = `${apiBasePath}/messaging/folders?page=1&per_page=999&useCache=false`;
  return apiRequest(path, {
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
export const getFolder = ({ folderId }) => {
  return apiRequest(
    `${apiBasePath}/messaging/folders/${folderId}?useCache=false`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
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
    body: JSON.stringify({ name: folderName }),
  });
};

/**
 * Update a folder's name.
 * @param {Long} folderId
 * @param {String} folderName
 * @returns
 */
export const updateFolderName = (folderId, folderName) => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: folderName }),
  });
};

/**
 * Delete a folder.
 * @param {Long} folderId
 * @returns
 */
export const deleteFolder = folderId => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}`, {
    method: 'DELETE',
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
      body: JSON.stringify(message),
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
      body: JSON.stringify(message),
    },
  );
};

/**
 * Create a new message.
 * @param {*} sendData
 * @param {Boolean} attachmentFlag
 * @returns
 */
export const createMessage = (sendData, attachmentFlag, ohTriageGroup) => {
  if (attachmentFlag === false) {
    return apiRequest(
      `${apiBasePath}/messaging/messages${
        ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: sendData,
      },
    );
  }
  return apiRequest(
    `${apiBasePath}/messaging/messages${
      ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
    }`,
    {
      method: 'POST',
      body: sendData,
    },
  );
};

/**
 * Create a new prescription renewal message.
 * @param {*} sendData
 * @param {Boolean} attachmentFlag
 * @param {Boolean} ohTriageGroup
 * @returns
 */
export const createRenewalMessage = (
  sendData,
  attachmentFlag,
  ohTriageGroup,
) => {
  if (attachmentFlag === false) {
    return apiRequest(
      `${apiBasePath}/messaging/messages/renewal${
        ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: sendData,
      },
    );
  }
  return apiRequest(
    `${apiBasePath}/messaging/messages/renewal${
      ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
    }`,
    {
      method: 'POST',
      body: sendData,
    },
  );
};

/**
 * Create a new "reply to" message.
 * @param {*} message
 * @returns
 */
export const createReplyToMessage = (
  replyToId,
  sendData,
  attachmentFlag,
  ohTriageGroup,
) => {
  if (attachmentFlag === false) {
    return apiRequest(
      `${apiBasePath}/messaging/messages/${replyToId}/reply${
        ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
      }`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: sendData,
      },
    );
  }
  return apiRequest(
    `${apiBasePath}/messaging/messages/${replyToId}/reply${
      ohTriageGroup ? `?is_oh_triage_group=${ohTriageGroup}` : ''
    }`,
    {
      method: 'POST',
      body: sendData,
    },
  );
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
 * Get message threads with full body and attachments.
 * @param {Long} messageId
 * @returns
 */
export const getMessageThreadWithFullBody = ({ messageId }) => {
  return apiRequest(
    `${apiBasePath}/messaging/messages/${messageId}/thread?full_body=true`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};

/**
 * Gets a list of threads in a folder.
 * @param {Long} folderId
 * @returns
 */
export const getThreadList = async params => {
  const {
    folderId = 0,
    pageSize = 10,
    pageNumber = 1,
    threadSort = threadSortingOptions.SENT_DATE_DESCENDING.value,
  } = params;
  const { sortField, sortOrder } = threadSortingOptions[threadSort];
  const { sessionExpiration, sessionExpirationSSO } = localStorage;

  const response = await apiRequest(
    `${apiBasePath}/messaging/folders/${folderId}/threads?pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${sortField}&sortOrder=${sortOrder}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Key-Inflection': 'camel',
      },
    },
  );
  if (sessionExpiration) {
    localStorage.setItem('sessionExpiration', sessionExpiration);
  }
  if (sessionExpirationSSO) {
    localStorage.setItem('sessionExpirationSSO', sessionExpirationSSO);
  }
  return response;
};

/**
 * Move message thread.
 * @param {Long} threadId
 * @param {Long} toFolderId
 * @returns
 */
export const moveMessageThread = (threadId, toFolderId) => {
  return apiRequest(
    `${apiBasePath}/messaging/threads/${threadId}/move?folder_id=${toFolderId}
   `,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
};
/**
 * Delete message thread (i.g. move to Trash folder).
 * @param {Long} threadId
 * @returns
 */
export const deleteMessageThread = threadId => {
  return apiRequest(
    `${apiBasePath}/messaging/threads/${threadId}/move?folder_id=${
      DefaultFolders.DELETED.id
    }
  `,
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
  return apiRequest(`${apiBasePath}/messaging/recipients?useCache=false`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Get a list of all recipients in triage teams.
 * @returns
 */
export const getAllRecipients = () => {
  return apiRequest(`${apiBasePath}/messaging/allrecipients?useCache=false`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Update list of preferred recipients in triage teams.
 * @returns
 */
export const updatePreferredRecipients = updatedTriageTeams => {
  return apiRequest(`${apiBasePath}/messaging/preferences/recipients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ updatedTriageTeams }),
  });
};

/**
 * Search a folder for messages based on criteria
 * @param {Int} folderId
 * @param {Object} query
 * @returns
 */
export const searchFolderAdvanced = (folderId, query) => {
  return apiRequest(`${apiBasePath}/messaging/folders/${folderId}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(query),
  });
};

/**
 * Get message signature from user preferences.
 * @returns {Object} signature object {data: {signatureName, includeSignature, signatureTitle}, errors:{}, metadata: {}}
 */
export const getSignature = () => {
  return apiRequest(`${apiBasePath}/messaging/preferences/signature`, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
};

export const submitLaunchMyVaHealthAal = () => {
  return apiRequest(`${apiBasePath}/aal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      aal: {
        activityType: 'Messaging',
        action: 'Launch My VA Health',
        performerType: 'Self',
        status: '1',
      },
      product: 'sm',
    }),
  });
};

export const submitLaunchMessagingAal = () => {
  return apiRequest(`${apiBasePath}/aal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      aal: {
        activityType: 'Messages',
        action: 'Launch Messages',
        performerType: 'Self',
        status: '1',
      },
      product: 'sm',
      oncePerSession: true,
    }),
  });
};
