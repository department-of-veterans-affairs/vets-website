import set from 'lodash/fp/set';

import {
  FETCH_FOLDERS_SUCCESS,
  FETCH_FOLDERS_FAILURE,
  FETCH_FOLDER_SUCCESS,
  FETCH_FOLDER_FAILURE
} from '../actions/folders';

const initialState = {
  currentItem: null,
  items: [],
  messages: []
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDERS_SUCCESS: {
      const items = action.data.data.map(folder => folder.attributes);
      return set('items', items, state);
    }
    case FETCH_FOLDER_SUCCESS: {
      const messages = action.data.data.map(message => message.attributes);
      return set('messages', messages, state);
    }
    case FETCH_FOLDERS_FAILURE:
    case FETCH_FOLDER_FAILURE:
    default:
      return state;
  }
}
