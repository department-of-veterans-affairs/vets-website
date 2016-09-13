import set from 'lodash/fp/set';

import {
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE
} from '../actions/folders';

const initialState = {
  currentItem: {
    messages: [],
    attrs: {}
  },
  items: []
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS: {
      const items = action.data.data.map(folder => folder.attributes);
      return set('items', items, state);
    }
    case FETCH_FOLDER_SUCCESS: {
      const data = action.data.data;
      const meta = action.data.meta;

      const attrs = state.items.find(folder => folder.folder_id === meta.id);
      const messages = data.map(message => message.attributes);

      const newItem = { attrs, messages };
      return set('currentItem', newItem, state);
    }
    case FETCH_FOLDERS_FAILURE:
    case FETCH_FOLDER_FAILURE:
    default:
      return state;
  }
}
