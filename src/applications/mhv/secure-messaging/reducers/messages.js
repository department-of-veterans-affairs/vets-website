import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of messages being displayed in the folder view/inbox
   * @type {array}
   */
  messageList: undefined,
};

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Message.GET_LIST:
      return {
        ...state,
        messageList: action.response.data.map(message => {
          const msgAttr = message.attributes;
          return {
            ...msgAttr,
          };
        }),
      };
    case 'b':
    default:
      return state;
  }
};
