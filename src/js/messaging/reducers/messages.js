import set from 'lodash/fp/set';

import {
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_FAILURE,
  SET_VISIBLE_DETAILS,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  UPDATE_REPLY_CHARACTER_COUNT
} from '../actions/messages';

import { composeMessageMaxChars } from '../config';

const initialState = {
  data: {
    thread: []
  },
  ui: {
    charsRemaining: composeMessageMaxChars,
    messagesCollapsed: new Set(),
    visibleDetailsId: null,
    moveToOpened: false
  }
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case FETCH_THREAD_SUCCESS: {
      const currentMessage = action.message.attributes;
      const thread = action.thread.map(message => message.attributes);
      const messagesCollapsed = new Set(thread.map((message) => {
        return message.messageId;
      }));
      thread.reverse();

      const newState = set('ui.messagesCollapsed', messagesCollapsed, state);
      thread.push(currentMessage);
      return set('data.thread', thread, newState);
    }

    case SET_VISIBLE_DETAILS:
      return set('ui.visibleDetailsId', action.messageId, state);

    case TOGGLE_MESSAGE_COLLAPSED: {
      // Don't allow the currently viewed message (last in thread)
      // to be collapsed.
      const thread = state.data.thread;
      const currentMessageId = thread[thread.length - 1].messageId;
      if (action.messageId === currentMessageId) {
        return state;
      }

      const newMessagesCollapsed = new Set(state.ui.messagesCollapsed);
      if (newMessagesCollapsed.has(action.messageId)) {
        newMessagesCollapsed.delete(action.messageId);
      } else {
        newMessagesCollapsed.add(action.messageId);
      }

      return set('ui.messagesCollapsed', newMessagesCollapsed, state);
    }

    case TOGGLE_MESSAGES_COLLAPSED: {
      // If any messages are collapsed at all, toggling
      // this option should expand all messages.
      // Only collapse all if everything has been expanded.
      const currentCollapsed = state.ui.messagesCollapsed;
      let newMessagesCollapsed = new Set();

      if (currentCollapsed.size === 0) {
        // The current message should never be collapsed.
        const messagesExceptCurrent = state.data.thread.slice(0, -1);
        newMessagesCollapsed =
          new Set(messagesExceptCurrent.map((message) => {
            return message.messageId;
          }));
      }

      return set('ui.messagesCollapsed', newMessagesCollapsed, state);
    }

    case TOGGLE_MOVE_TO:
      return set('ui.moveToOpened', !state.ui.moveToOpened, state);

    case UPDATE_REPLY_CHARACTER_COUNT:
      return set('ui.charsRemaining', action.chars, state);

    case FETCH_THREAD_FAILURE:
    default:
      return state;
  }
}
