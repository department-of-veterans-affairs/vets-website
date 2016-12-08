import _ from 'lodash';
import set from 'lodash/fp/set';

import { folderUrl } from '../utils/helpers';

import {
  CREATE_FOLDER_SUCCESS,
  DELETE_COMPOSE_MESSAGE,
  DELETE_FOLDER_SUCCESS,
  DELETE_MESSAGE_SUCCESS,
  FETCH_FOLDER_FAILURE,
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
    items: new Map()
  },
  ui: {
    loading: {
      inProgress: false,
      request: null
    },
    nav: {
      foldersExpanded: false,
      visible: false
    },
    redirect: null
  }
};

const folderKey = (folderName) => _.kebabCase(folderName);

export default function folders(state = initialState, action) {
  switch (action.type) {
    // TODO: Handle the response in an appropriate way
    case CREATE_FOLDER_SUCCESS: {
      const folder = action.folder;
      const newFolders = new Map(state.data.items);
      newFolders.set(folderKey(folder.name), folder);
      return set('data.items', newFolders, state);
    }

    case DELETE_FOLDER_SUCCESS: {
      const folder = action.folder;
      const newFolders = new Map(state.data.items);
      newFolders.delete(folderKey(folder.name));
      return set('data.items', newFolders, state);
    }

    case FETCH_FOLDER_FAILURE:
      return set('ui.loading.inProgress', false, state);

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

      return set('ui.loading.inProgress', false, newState);
    }

    case FETCH_FOLDERS_SUCCESS: {
      const items = new Map();
      action.data.data.forEach((folder) => {
        const item = folder.attributes;
        items.set(folderKey(item.name), item);
      });

      return set('data.items', items, state);
    }

    case LOADING_FOLDER: {
      let newState = set(
        'data.currentItem',
        initialState.data.currentItem,
        state
      );

      newState = set(
        'data.currentItem.persistFolder',
        action.request.id,
        newState
      );

      return set('ui.loading', {
        inProgress: true,
        request: action.request
      }, newState);
    }

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
      // Upon completing any of these actions, set the redirect to the most
      // recent folder. Default to 'Inbox' if no folder has been visited.
      const folderName = _.get(
        state,
        'data.currentItem.attributes.name',
        'Inbox'
      );

      const url = folderUrl(folderName);
      return set('ui.redirect', url, state);
    }

    case RESET_REDIRECT:
      return set('ui.redirect', null, state);

    default:
      return state;
  }
}
