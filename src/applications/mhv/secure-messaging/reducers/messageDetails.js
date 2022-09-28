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
      const msgAttr = action.response.data.attributes;
      return {
        ...state,
        message: {
          ...msgAttr,
        },
      };
    }
    case Actions.Message.GET_HISTORY: {
      return {
        ...state,
        messageHistory: action.response.data.map(message => {
          const msgAttr = message.attributes.attributes;
          return {
            ...msgAttr,
          };
        }),
      };
    }
    default:
      return state;
  }
};
