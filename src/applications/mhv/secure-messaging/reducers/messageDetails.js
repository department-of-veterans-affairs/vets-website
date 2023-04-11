import { Actions } from '../util/actionTypes';
import { updateMessageInThread } from '../util/helpers';

const initialState = {
  /**
   * The message currently being displayed to the user
   */
  message: undefined,
  /**
   * The message history for the currently displayed message
   * @type {array}
   */
  messageHistory: undefined,
  /**
   * The message thread currently displayed to the user
   */
  isLoading: false,
  error: null,
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
        error: action.response,
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
      return { ...state, messageHistory: { ...initialState } };
    }
    default:
      return state;
  }
};
