import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  CLEAR_DRAFT,
  FETCH_THREAD_SUCCESS,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  UPDATE_DRAFT
} from '../actions/messages';

import { composeMessage } from '../config';

const initialState = {
  data: {
    message: null,
    thread: [],
    draft: {
      body: makeField(''),
      charsRemaining: composeMessage.maxChars.message
    }
  },
  ui: {
    messagesCollapsed: new Set(),
    moveToOpened: false
  }
};

const resetDraft = (state) => {
  return set('data.draft', initialState.data.draft, state);
};

export default function folders(state = initialState, action) {
  switch (action.type) {
    case CLEAR_DRAFT:
      return resetDraft(state);

    case FETCH_THREAD_SUCCESS: {
      const currentMessage = action.message.attributes;
      const thread = action.thread.map(message => message.attributes);
      const messagesCollapsed = new Set(thread.map((message) => {
        return message.messageId;
      }));

      // Thread is received in most recent order.
      // Reverse to display most recent message at the bottom.
      thread.reverse();

      let newState = set('ui', {
        messagesCollapsed,
        moveToOpened: false
      }, state);

      // The message is the draft if it hasn't been sent yet.
      // Otherwise, the draft is an new, unsaved reply to the message.
      let draft;
      if (!currentMessage.sentDate) {
        draft = Object.assign({}, currentMessage, {
          body: makeField(currentMessage.body),
          charsRemaining: composeMessage.maxChars.message -
                          currentMessage.body.length,
          replyMessageId: thread.length === 0 ?
                          undefined :
                          thread[thread.length - 1].messageId
        });
      } else {
        draft = Object.assign({}, initialState.data.draft, {
          category: currentMessage.category,
          recipientId: currentMessage.senderId,
          replyMessageId: currentMessage.messageId,
          subject: currentMessage.subject
        });
      }

      newState = set('data.thread', thread, newState);
      newState = set('data.draft', draft, newState);
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

    case UPDATE_DRAFT:
      return set('data.draft', {
        body: action.field,
        charsRemaining: composeMessage.maxChars.message -
                        action.field.value.length
      }, state);

    default:
      return state;
  }
}
