import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields.js';

import {
  CLOSE_CREATE_FOLDER,
  OPEN_CREATE_FOLDER,
  TOGGLE_CONFIRM_DELETE,
  TOGGLE_ATTACHMENTS,
  SET_NEW_FOLDER_NAME
} from '../actions/modals';

const initialState = {
  deleteConfirm: {
    visible: false
  },
  attachments: {
    visible: false
  },
  createFolder: {
    visible: false,
    newFolderName: makeField('')
  }
};

export default function modals(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_CONFIRM_DELETE:
      return set('deleteConfirm.visible', !state.deleteConfirm.visible, state);
    case TOGGLE_ATTACHMENTS:
      return set('attachments.visible', !state.attachments.visible, state);
    case CLOSE_CREATE_FOLDER:
      return set('createFolder', initialState.createFolder, state);
    case OPEN_CREATE_FOLDER:
      // If a message is provided, it gets moved to the newly created folder.
      return set('createFolder', {
        visible: true,
        newFolderName: makeField(''),
        messageId: action.messageId
      }, state);
    case SET_NEW_FOLDER_NAME:
      return set('createFolder.newFolderName', action.folderName, state);
    default:
      return state;
  }
}
