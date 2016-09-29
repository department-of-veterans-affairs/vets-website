import { browserHistory } from 'react-router';

import { DELETE_MESSAGE_SUCCESS } from '../actions/messages';

export default function redirects(state = {}, action) {
  switch (action.type) {
    case DELETE_MESSAGE_SUCCESS: {
      if (action.redirect) {
        browserHistory.push(action.redirect);
      }

      return state;
    }
    default:
      return state;
  }
}
