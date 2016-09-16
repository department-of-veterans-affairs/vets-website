import set from 'lodash/fp/set';

import {
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_FAILURE,
  SET_VISIBLE_DETAILS
} from '../actions/messages';

const initialState = {
  data: {
    thread: []
  },
  ui: {
    // messagesCollapsed: true,
    visibleDetailsId: null
  }
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_THREAD_SUCCESS: {
      const messages = action.data.data.map(message => message.attributes);
      return set('data.thread', messages, state);
    }
    case SET_VISIBLE_DETAILS:
      return set('ui.visibleDetailsId', action.messageId, state);
    case FETCH_THREAD_FAILURE:
    default:
      return state;
  }
}
