import _ from 'lodash';
import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  CLEAR_DRAFT,
  FETCH_THREAD_SUCCESS,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  UPDATE_DRAFT_BODY,
  UPDATE_DRAFT_CHARACTER_COUNT
} from '../actions/messages';

import { composeMessage } from '../config';

const initialState = {
  data: {
    message: null,
    thread: [],
    draft: {
      body: makeField(''),
      charsRemaining: composeMessage.maxChars.message,
      replyMessageId: null
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

      const newUi = {
        messagesCollapsed,
        movedToOpened: false
      };

      let newState = set('ui', newUi, state);
      let draft = initialState.data.draft;

      // If the message hasn't been sent, treat it as the draft
      // and reply to the thread (if it exists).
      // Otherwise, treat the draft as the reply to the message.
      if (!currentMessage.sentDate) {
        const draft = Object.assign({}, currentMessage, {
          body: makeField(currentMessage.body),
          charsRemaining: composeMessage.maxChars.message -
                          currentMessage.body.length,
          replyMessageId: null
        });

        if (thread.length > 0) {
          draft.replyMessageId = thread[thread.length - 1].messageId;
        }
      } else {
        draft.replyMessageId = currentMessage.messageId;
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

    case UPDATE_DRAFT_BODY:
      return set('data.draft.body', action.field, state);

    case UPDATE_DRAFT_CHARACTER_COUNT:
      return set('data.draft.charsRemaining', action.chars, state);

    default:
      return state;
  }
}
