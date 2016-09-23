import set from 'lodash/fp/set';

import {
  CREATE_NEW_FOLDER,
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE,
  TOGGLE_FOLDER_NAV,
  TOGGLE_MANAGED_FOLDERS,
  SET_CURRENT_FOLDER
} from '../actions/folders';

const initialState = {
  data: {
    currentItem: {
      attributes: {},
      messages: [],
      pagination: {
        currentPage: 0,
        perPage: 0,
        totalEntries: 0,
        totalPages: 0
      },
      persistFolder: null
    },
    items: []
  },
  ui: {
    nav: {
      foldersExpanded: false,
      visible: false
    }
  }
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS: {
      const items = action.data.data.map(folder => folder.attributes);
      return set('data.items', items, state);
    }
    case FETCH_FOLDER_SUCCESS: {
      const attributes = action.folder.data.attributes;
      const messages = action.messages.data.map(message => message.attributes);
      const pagination = action.messages.meta.pagination;
      const persistFolder = action.folder.data.attributes.folderId;

      const newItem = {
        attributes,
        messages,
        pagination,
        persistFolder
      };

      return set('data.currentItem', newItem, state);
    }
    case TOGGLE_FOLDER_NAV:
      return set('ui.nav.visible', !state.ui.nav.visible, state);
    case TOGGLE_MANAGED_FOLDERS:
      return set('ui.nav.foldersExpanded', !state.ui.nav.foldersExpanded, state);
    case SET_CURRENT_FOLDER:
      // The + forces +action.folderId to be a number
      return set('data.currentItem.persistFolder', +action.folderId, state);
    // TODO: Make CREATE_NEW_FOLDER request a new folder creation.
    case CREATE_NEW_FOLDER:
    case FETCH_FOLDERS_FAILURE:
    case FETCH_FOLDER_FAILURE:
    default:
      return state;
  }
}
