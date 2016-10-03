export const CLOSE_CREATE_FOLDER = 'CLOSE_CREATE_FOLDER';
export const OPEN_CREATE_FOLDER = 'OPEN_CREATE_FOLDER';
export const TOGGLE_CONFIRM_DELETE = 'TOGGLE_CONFIRM_DELETE';
export const TOGGLE_ATTACHMENTS = 'TOGGLE_ATTACHMENTS';
export const SET_NEW_FOLDER_NAME = 'SET_NEW_FOLDER_NAME';

export function closeCreateFolderModal() {
  return { type: CLOSE_CREATE_FOLDER };
}

export function openCreateFolderModal() {
  return { type: OPEN_CREATE_FOLDER };
}

export function openMoveToNewFolderModal(messageId) {
  return {
    type: OPEN_CREATE_FOLDER,
    messageId
  };
}

export function toggleConfirmDelete() {
  return { type: TOGGLE_CONFIRM_DELETE };
}

export function toggleAttachmentsModal() {
  return { type: TOGGLE_ATTACHMENTS };
}

export function setNewFolderName(folderName) {
  return {
    type: SET_NEW_FOLDER_NAME,
    folderName
  };
}
