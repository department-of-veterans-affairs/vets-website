import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The message currently being displayed to the user
   */
  message: undefined,
  /**
   * The message thread for the currently displayed message
   * @type {array}
   */
  messageThread: undefined,
};

export const messageDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Message.GET: {
      const msgAttr = action.response.data.attributes;
      return {
        ...state,
        message: {
          id: msgAttr.messageId,
          category: msgAttr.category,
          subject: msgAttr.subject,
          body: msgAttr.body,
          attachment: msgAttr.attachment,
          sentDate: msgAttr.sentDate,
          senderId: msgAttr.senderId,
          senderName: msgAttr.senderName,
          recipientId: msgAttr.recipientId,
          recipientName: msgAttr.recipientName,
          readReceipt: msgAttr.readReceipt,
        },
      };
    }
    case 'b':
    default:
      return state;
  }
};
