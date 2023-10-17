import { Actions } from '../util/actionTypes';
import { updateMessageInThread } from '../util/helpers';
import { PrintMessageOptions } from '../util/constants';

const initialState = {
  /**
   * The message currently being displayed to the user
   */
  message: undefined,
  /**
   * The message thread currently displayed to the user
   * @type {array}
   */
  messageHistory: undefined,
  isLoading: false,
  error: null,
  printOption: PrintMessageOptions.PRINT_THREAD,
  threadViewCount: 5,

  /** for messages older than 45 days, we cannot reply */
  cannotReply: false,
};

export const messageDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Message.GET: {
      const { data, included } = action.response;
      const msgAttachments =
        included &&
        included.map(item => ({
          id: item.id,
          link: item.links.download,
          ...item.attributes,
        }));
      return {
        ...state,
        message: {
          replyToName: data.replyToName,
          threadFolderId: data.threadFolderId,
          ...data.attributes,
          attachments: msgAttachments,
        },
      };
    }
    case Actions.Message.GET_IN_THREAD: {
      return {
        ...state,
        messageHistory: updateMessageInThread(
          state.messageHistory,
          action.response,
        ),
      };
    }
    case Actions.Message.MOVE_REQUEST: {
      return {
        ...state,
        isLoading: true,
      };
    }
    case Actions.Message.MOVE_FAILED: {
      return {
        ...state,
        isLoading: false,
      };
    }
    case Actions.Message.CLEAR:
      return {
        ...initialState,
      };
    case Actions.Message.GET_HISTORY: {
      return {
        ...state,
        messageHistory: action.response.data.map(message => {
          return message.attributes;
        }),
      };
    }
    case Actions.Message.CLEAR_HISTORY: {
      return { ...state, messageHistory: { ...initialState.messageHistory } };
    }
    case Actions.Message.SET_THREAD_PRINT_OPTION: {
      return { ...state, printOption: action.payload };
    }
    case Actions.Message.SET_THREAD_VIEW_COUNT: {
      return { ...state, threadViewCount: action.payload };
    }
    case Actions.Message.CANNOT_REPLY_ALERT: {
      return { ...state, cannotReply: action.payload };
    }
    default:
      return state;
  }
};
