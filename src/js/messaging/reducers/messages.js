import set from 'lodash/fp/set';

import {
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_FAILURE,
} from '../actions/messages';

const initialState = {
  thread: []
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_THREAD_SUCCESS: {
      const messages = action.data.data.map(message => message.attributes);
      return set('thread', messages, state);
    }
    case FETCH_THREAD_FAILURE:
    default:
      return state;
  }
}
