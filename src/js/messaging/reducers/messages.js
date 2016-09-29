import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  DELETE_REPLY,
  FETCH_THREAD_SUCCESS,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  UPDATE_REPLY_BODY,
  UPDATE_REPLY_CHARACTER_COUNT
} from '../actions/messages';

import { composeMessage } from '../config';

const initialState = {
  data: {
    message: null,
    thread: [],
    reply: {
      body: makeField(''),
      charsRemaining: composeMessage.maxChars.message
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
    charsRemaining: composeMessage.maxChars.message
  };

  return set('data.reply', newReply, state);
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case DELETE_REPLY:
      return resetReply(state);

    case FETCH_THREAD_SUCCESS: {
      const currentMessage = action.message.attributes;
      const thread = action.thread.map(message => message.attributes).reverse();
      const messagesCollapsed = new Set(thread.map((message) => {
        return message.messageId;
      }));

      const newUi = {
        messagesCollapsed,
        movedToOpened: false
      };

      let newState = set('ui', newUi, state);
      newState = resetReply(newState);
      newState = set('data.thread', thread, newState);

      if (!currentMessage.sentDate) {
        const body = makeField(currentMessage.body);
        const charsRemaining =
          composeMessage.maxChars.message - currentMessage.body.length;

        const reply = { body, charsRemaining };
        newState = set('data.reply', reply, newState);
      }

      return set('data.message', currentMessage, newState);
    }

    case TOGGLE_MESSAGE_COLLAPSED: {
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
        newMessagesCollapsed = new Set(state.data.thread.map((message) => {
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

    default:
      return state;
  }
}
