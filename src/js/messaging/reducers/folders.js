import { browserHistory } from 'react-router';
import set from 'lodash/fp/set';
import concat from 'lodash/fp/concat';

import { DELETE_COMPOSE_MESSAGE } from '../actions/compose';

import {
  CREATE_NEW_FOLDER_SUCCESS,
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDER_SUCCESS,
  TOGGLE_FOLDER_NAV,
  TOGGLE_MANAGED_FOLDERS,
  SET_CURRENT_FOLDER
} from '../actions/folders';

import {
  DELETE_MESSAGE_SUCCESS,
  SAVE_DRAFT_SUCCESS,
  SEND_MESSAGE_SUCCESS
} from '../actions/messages';

import { paths } from '../config';

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
      persistFolder: 0
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
    // TODO: Handle the response in an appropriate way
    case CREATE_NEW_FOLDER_SUCCESS: {
      const newFolderList = concat(state.data.items, action.data.data.attributes);
      return set('data.items', newFolderList, state);
    }

    case DELETE_COMPOSE_MESSAGE:
    case DELETE_MESSAGE_SUCCESS:
    case SAVE_DRAFT_SUCCESS:
    case SEND_MESSAGE_SUCCESS: {
      // Upon completing any of these actions, go to the most recent folder.
      const currentFolderId = state.data.currentItem.persistFolder;
      const returnUrl = `${paths.FOLDERS_URL}/${currentFolderId}`;
      browserHistory.replace(returnUrl);
      return state;
    }

    default:
      return state;
  }
}
