import set from 'lodash/fp/set';

import {
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE,
  TOGGLE_FOLDER_NAV
} from '../actions/folders';

const initialState = {
  data: {
    currentItem: {
      id: null,
      messages: [],
      startCount: 0,
      endCount: 0,
      totalCount: 0
    },
    items: []
  },
  ui: {
    nav: {
      expanded: false
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
      const meta = action.data.meta;

      // Set the messages of the currently viewed folder.
      const id = meta.folder_id;
      const messages = action.data.data.map(
        message => message.attributes
      );

      // Set the pagination data for the folder.
      const totalCount = meta.count;
      const startCount = 1 + (meta.current_page - 1) * meta.per_page;
      const endCount = Math.min(totalCount, meta.current_page * meta.per_page);

      const newItem = {
        id,
        messages,
        startCount,
        endCount,
        totalCount
      };

      return set('data.currentItem', newItem, state);
    }
    case TOGGLE_FOLDER_NAV:
      return set('ui.nav.expanded', !state.ui.nav.expanded, state);
    case FETCH_FOLDERS_FAILURE:
    case FETCH_FOLDER_FAILURE:
    default:
      return state;
  }
}
