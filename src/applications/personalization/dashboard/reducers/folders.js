import _ from 'lodash';
import set from '~/platform/utilities/data/set';

import {
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE,
  LOADING_FOLDER,
} from '../actions/messaging';

const initialState = {
  data: {
    currentItem: {
      attributes: {},
      fetching: false,
      filter: {},
      messages: [],
      pagination: {},
      sort: {
        value: 'sentDate',
        order: 'DESC',
      },
    },
    items: new Map(),
  },
  ui: {
    lastRequestedFolder: null,
    moveToId: null,
    nav: {
      foldersExpanded: false,
      visible: false,
    },
    redirect: null,
  },
};

const folderKey = folderName => _.kebabCase(folderName);

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDER_SUCCESS: {
      const { attributes } = action.folder.data;
      const messages = action.messages.data.map(message => message.attributes);

      const { meta } = action.messages;
      const { filter } = meta;
      const { pagination } = meta;
      const { sort } = meta;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];

      // Update corresponding folder data in map.
      const newItems = new Map(state.data.items);
      newItems.set(folderKey(attributes.name), attributes);
      const newState = set('data.items', newItems, state);

      return set(
        'data.currentItem',
        {
          attributes,
          fetching: false,
          filter,
          messages,
          pagination,
          sort: {
            value: sortValue,
            order: sortOrder,
          },
          errors: null,
        },
        newState,
      );
    }

    case FETCH_FOLDER_FAILURE: {
      return set(
        'data.currentItem',
        {
          errors: action?.errors,
          fetching: false,
        },
        state,
      );
    }

    case LOADING_FOLDER: {
      const newState = set(
        'data.currentItem',
        {
          ...initialState.data.currentItem,
          fetching: true,
        },
        state,
      );

      return set(
        'ui',
        {
          ...initialState.ui,
          nav: {
            foldersExpanded: state.ui.nav.foldersExpanded,
            visible: false,
          },
          lastRequestedFolder: action.request,
        },
        newState,
      );
    }

    default:
      return state;
  }
}
