import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields.js';
import { composeMessage } from '../config';

import {
  CLOSE_ATTACHMENTS_MODAL,
  CLOSE_CREATE_FOLDER,
  OPEN_ATTACHMENTS_MODAL,
  OPEN_CREATE_FOLDER,
  SET_NEW_FOLDER_NAME,
  TOGGLE_CONFIRM_DELETE
} from '../utils/constants';

const initialState = {
  deleteConfirm: {
    visible: false
  },
  attachments: {
    visible: false,
    message: {
      title: null,
      text: null
    }
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
    case CLOSE_ATTACHMENTS_MODAL:
      return set('attachments', initialState.attachments, state);
    case CLOSE_CREATE_FOLDER:
      return set('createFolder', initialState.createFolder, state);
    case OPEN_ATTACHMENTS_MODAL:
      return set('attachments', {
        visible: true,
        message: composeMessage.errors.attachments[action.error.type]
      }, state);
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
