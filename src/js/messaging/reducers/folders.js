import set from 'lodash/fp/set';

import { FETCH_FOLDER_SUCCESS, FETCH_FOLDER_FAILURE } from '../actions/folders';

const initialState = {
  items: []
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_FOLDER_SUCCESS:
      const folders = action.data.data.map(folder => folder.attributes);
      return set('items', folders, state);
    case FETCH_FOLDER_FAILURE:
    default:
      return state;
  }
}
