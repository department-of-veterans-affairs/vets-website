import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  DELETE_REPLY,
  FETCH_THREAD_SUCCESS,
  FETCH_THREAD_FAILURE,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  UPDATE_REPLY_BODY,
  UPDATE_REPLY_CHARACTER_COUNT
} from '../actions/messages';

import { composeMessageMaxChars } from '../config';

const initialState = {
  data: {
    thread: [],
    reply: {
      body: makeField(''),
      charsRemaining: composeMessageMaxChars
    }
  },
  ui: {
    messagesCollapsed: new Set(),
    moveToOpened: false
  }
};

const resetReply = (state) => {
  const newReply = {
    body: makeField(''),
    charsRemaining: composeMessageMaxChars
  };

  return set('data.reply', newReply, state);
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case DELETE_REPLY: {
      return resetReply(state);
    }

    case FETCH_THREAD_SUCCESS: {
      const currentMessage = action.message.attributes;
      const thread = action.thread.map(message => message.attributes);
      const messagesCollapsed = new Set(thread.map((message) => {
        return message.messageId;
      }));

      const newUi = {
        messagesCollapsed,
        movedToOpened: false
      };

      let newState = set('ui', newUi, state);
      newState = resetReply(newState);

      thread.reverse();
      thread.push(currentMessage);
      return set('data.thread', thread, newState);
    }

    case SEND_MESSAGE_SUCCESS:
      return state;

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

    case UPDATE_REPLY_BODY:
      return set('data.reply.body', action.field, state);

    case UPDATE_REPLY_CHARACTER_COUNT:
      return set('data.reply.charsRemaining', action.chars, state);

    case FETCH_THREAD_FAILURE:
    case SEND_MESSAGE_FAILURE:
    default:
      return state;
  }
}
