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
          return {
            id: message.attributes.messageId,
            category: message.attributes.category,
            subject: message.attributes.subject,
            body: message.attributes.body,
            attachment: message.attributes.attachment,
            sentDate: message.attributes.sentDate,
            senderId: message.attributes.senderId,
            senderName: message.attributes.senderName,
            recipientId: message.attributes.recipientId,
            recipientName: message.attributes.recipientName,
            readReceipt: message.attributes.readReceipt,
          };
        }),
      };
    case 'b':
    default:
      return state;
  }
};
