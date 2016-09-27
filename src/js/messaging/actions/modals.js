export const TOGGLE_CONFIRM_DELETE = 'TOGGLE_CONFIRM_DELETE';
export const TOGGLE_ATTACHMENTS = 'TOGGLE_ATTACHMENTS';
export const TOGGLE_CREATE_FOLDER = 'TOGGLE_CREATE_FOLDER';
export const SET_NEW_FOLDER_NAME = 'SET_NEW_FOLDER_NAME';


export function toggleConfirmDelete() {
  return {
    type: TOGGLE_CONFIRM_DELETE
  };
}


export function toggleAttachmentsModal() {
  return {
    type: TOGGLE_ATTACHMENTS
  };
}

export function toggleCreateFolderModal() {
  return {
    type: TOGGLE_CREATE_FOLDER
  };
}


export function setNewFolderName(folderName) {
  return {
    type: SET_NEW_FOLDER_NAME,
    folderName
  };
}
