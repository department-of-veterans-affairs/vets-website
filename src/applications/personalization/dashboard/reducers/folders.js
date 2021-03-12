import _ from 'lodash';
import set from 'lodash/fp/set';

import { FETCH_FOLDER_SUCCESS, LOADING_FOLDER } from '../utils/constants';

const initialState = {
  data: {
    currentItem: {
      attributes: {},
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
      const attributes = action.folder?.data?.attributes;
      const messages = action.messages?.data.map(
        message => message?.attributes,
      );

      const meta = action.messages?.meta;
      const filter = meta?.filter;
      const pagination = meta?.pagination;
      const sort = meta?.sort;
      const sortValue = Object.keys(sort)[0];
      const sortOrder = sort[sortValue];

      // Update corresponding folder data in map.
      const newItems = new Map(state.data.items);
      newItems.set(folderKey(attributes?.name), attributes);
      const newState = set('data.items', newItems, state);

      return set(
        'data.currentItem',
        {
          attributes,
          filter,
          messages,
          pagination,
          sort: {
            value: sortValue,
            order: sortOrder,
          },
        },
        newState,
      );
    }

    case LOADING_FOLDER: {
      const newState = set(
        'data.currentItem',
        initialState.data.currentItem,
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
