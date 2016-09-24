import set from 'lodash/fp/set';

import {
  TOGGLE_CONFIRM_DELETE,
  TOGGLE_ATTACHMENTS,
  TOGGLE_CREATE_FOLDER
} from '../actions/modals';

const initialState = {
  deleteConfirm: {
    visible: false
  },
  attachments: {
    visible: false
  },
  createFolder: {
    visible: false
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
    default:
      return state;
  }
}
