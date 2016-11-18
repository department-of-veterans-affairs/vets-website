import set from 'lodash/fp/set';
import concat from 'lodash/fp/concat';

import { paths } from '../config';

import {
  CREATE_FOLDER_SUCCESS,
  DELETE_COMPOSE_MESSAGE,
  DELETE_FOLDER_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDERS_SUCCESS,
  LOADING_FOLDER,
  MOVE_MESSAGE_SUCCESS,
  RESET_REDIRECT,
  SAVE_DRAFT_SUCCESS,
  SEND_MESSAGE_SUCCESS,
  SET_CURRENT_FOLDER,
  TOGGLE_FOLDER_NAV,
  TOGGLE_MANAGED_FOLDERS
} from '../utils/constants';

const initialState = {
  data: {
    currentItem: {
      attributes: {},
      filter: {},
      messages: [],
      pagination: {
        currentPage: 0,
        perPage: 0,
        totalEntries: 0,
        totalPages: 0
      },
      persistFolder: 0,
      sort: {
        value: 'sentDate',
        order: 'DESC'
      }
    },
    items: []
  },
  ui: {
    loading: false,
    nav: {
      foldersExpanded: false,
      visible: false
    },
    redirect: null
  }
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    // TODO: Handle the response in an appropriate way
    case CREATE_FOLDER_SUCCESS: {
      const newFolderList = concat(state.data.items, action.folder);
      return set('data.items', newFolderList, state);
    }

    case DELETE_FOLDER_SUCCESS: {
      const newFolders = state.data.items.filter(folder => {
        return folder.folderId !== action.folder.folderId;
      });

      return set('data.items', newFolders, state);
    }

    case FETCH_FOLDER_SUCCESS: {
      const attributes = action.folder.data.attributes;
      const messages = action.messages.data.map(message => message.attributes);
      const persistFolder = action.folder.data.attributes.folderId;

      const meta = action.messages.meta;
      const filter = meta.filter;
      const pagination = meta.pagination;
      const sort = meta.sort;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];

      const newState = set('data.currentItem', {
        attributes,
        filter,
        messages,
        pagination,
        persistFolder,
        sort: { value: sortValue, order: sortOrder },
      }, state);

      return set('ui.loading', false, newState);
    }

    case FETCH_FOLDERS_SUCCESS: {
      const items = action.data.data.map(folder => folder.attributes);
      return set('data.items', items, state);
    }

    case LOADING_FOLDER:
      return set('ui.loading', true, state);

    case TOGGLE_FOLDER_NAV:
      return set('ui.nav.visible', !state.ui.nav.visible, state);

    case TOGGLE_MANAGED_FOLDERS:
      return set('ui.nav.foldersExpanded', !state.ui.nav.foldersExpanded, state);

    case SET_CURRENT_FOLDER:
      // The + forces +action.folderId to be a number
      return set('data.currentItem.persistFolder', +action.folderId, state);

    case DELETE_COMPOSE_MESSAGE:
    case DELETE_MESSAGE_SUCCESS:
    case MOVE_MESSAGE_SUCCESS:
    case SAVE_DRAFT_SUCCESS:
    case SEND_MESSAGE_SUCCESS: {
      // Upon completing any of these actions,
      // set the redirect to the most recent folder.
      const lastFolderId = state.data.currentItem.persistFolder;
      const url = `${paths.FOLDERS_URL}/${lastFolderId}`;
      return set('ui.redirect', url, state);
    }

    case RESET_REDIRECT:
      return set('ui.redirect', null, state);

    default:
      return state;
  }
}
