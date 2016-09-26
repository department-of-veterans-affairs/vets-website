import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields.js';
import {
  TOGGLE_CONFIRM_DELETE,
  TOGGLE_ATTACHMENTS,
  TOGGLE_CREATE_FOLDER,
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
    case TOGGLE_CREATE_FOLDER:
      return set('createFolder.visible', !state.createFolder.visible, state);
    case SET_NEW_FOLDER_NAME:
      return set('createFolder.newFolderName', action.folderName, state);
    default:
      return state;
  }
}
