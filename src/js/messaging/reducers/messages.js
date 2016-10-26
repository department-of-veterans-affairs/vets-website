import set from 'lodash/fp/set';

import { makeField } from '../../common/model/fields';

import {
  ADD_DRAFT_ATTACHMENTS,
  CLEAR_DRAFT,
  DELETE_DRAFT_ATTACHMENT,
  FETCH_THREAD_SUCCESS,
  TOGGLE_MESSAGE_COLLAPSED,
  TOGGLE_MESSAGES_COLLAPSED,
  TOGGLE_MOVE_TO,
  TOGGLE_REPLY_DETAILS,
  UPDATE_DRAFT
} from '../utils/constants';

const initialState = {
  data: {
    message: null,
    thread: [],
    draft: {
      attachments: [],
      body: makeField(''),
      category: makeField(''),
      recipient: makeField(''),
      subject: makeField('')
    }
  },
  ui: {
    messagesCollapsed: new Set(),
    moveToOpened: false,
    replyDetailsCollapsed: true
  }
};

const resetDraft = (state) => {
  return set('data.draft', initialState.data.draft, state);
};

export default function messages(state = initialState, action) {
  switch (action.type) {
    case ADD_DRAFT_ATTACHMENTS:
      return set('data.draft.attachments', [
        ...state.data.draft.attachments,
        ...action.files
      ], state);

    case CLEAR_DRAFT:
      return resetDraft(state);

    case DELETE_DRAFT_ATTACHMENT:
      state.data.draft.attachments.splice(action.index, 1);
      return set('data.draft.attachments', state.data.draft.attachments, state);

    case FETCH_THREAD_SUCCESS: {
      // Consolidate message attributes and attachments
      const currentMessage = Object.assign({}, action.message.data.attributes, { attachments: action.message.included });
      const thread = action.thread.map(message => message.attributes);

      // Collapse all the previous messages in the thread.
      const messagesCollapsed = new Set(thread.map((message) => {
        return message.messageId;
      }));

      // Thread is received in most recent order.
      // Reverse to display most recent message at the bottom.
      thread.reverse();

      const draft = initialState.data.draft;
      draft.category = makeField(currentMessage.category);
      draft.subject = makeField(currentMessage.subject);

      // The message is the draft if it hasn't been sent yet.
      // Otherwise, the draft is an new, unsaved reply to the message.
      if (!currentMessage.sentDate) {
        draft.attachments = currentMessage.attachments || [];
        draft.body = makeField(currentMessage.body);
        draft.recipient = makeField(currentMessage.recipientId.toString());
        draft.replyMessageId = thread.length === 0
                             ? undefined
                             : thread[thread.length - 1].messageId;
      } else {
        draft.recipient = makeField(currentMessage.senderId.toString());
        draft.replyMessageId = currentMessage.messageId;
      }

      let newState = set('ui', { ...initialState.ui, messagesCollapsed }, state);
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

    case TOGGLE_REPLY_DETAILS:
      return set('ui.replyDetailsCollapsed', !state.ui.replyDetailsCollapsed, state);

    case UPDATE_DRAFT:
      return set(`data.draft.${action.key}`, action.field, state);

    default:
      return state;
  }
}
