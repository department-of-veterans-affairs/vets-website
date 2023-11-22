import { Actions } from '../util/actionTypes';
import { PrintMessageOptions } from '../util/constants';
import { updateMessageInThread } from '../util/helpers';

const initialState = {
  drafts: undefined,
  messages: undefined,
  isLoading: false,
  replyToName: undefined,
  threadFolderId: undefined,
  replyToMessageId: undefined,
  cannotReply: false,
  printOption: PrintMessageOptions.PRINT_THREAD,
  threadViewCount: 5,
};

export const threadDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Thread.GET_THREAD:
      return {
        ...state,
        ...action.payload,
      };
    case Actions.Thread.GET_MESSAGE_IN_THREAD: {
      return {
        ...state,
        messages: updateMessageInThread(state.messages, action.response),
      };
    }
    case Actions.Thread.CANNOT_REPLY_ALERT: {
      return { ...state, cannotReply: action.payload };
    }
    case Actions.Thread.SET_THREAD_VIEW_COUNT: {
      return { ...state, threadViewCount: action.payload };
    }
    default:
      return state;
  }
};
