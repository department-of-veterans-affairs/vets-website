import { Actions } from '../util/actionTypes';

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
          ...data.attributes,
          attachments: msgAttachments,
        },
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
