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
      return {
        ...state,
        message: {
          ...action.response.data.attributes,
          attachments: action.response.included.map(attachment => {
            return {
              attachmentId: attachment.id,
              ...attachment.attributes,
            };
          }),
        },
      };
    }
    case Actions.Message.GET_HISTORY: {
      return {
        ...state,
        messageHistory: action.response.data.map(message => {
          return message.attributes.attributes;
        }),
      };
    }
    default:
      return state;
  }
};
