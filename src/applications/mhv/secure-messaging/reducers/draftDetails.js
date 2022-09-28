import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The draft message that the user is currently composing
   */
  draftMessage: undefined,
  /**
   * The message history for the current draft message
   * @type {array}
   */
  draftMessageHistory: undefined,
};

export const draftDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Draft.GET: {
      const msgAttr = action.response.data.attributes;
      return {
        ...state,
        draftMessage: {
          ...msgAttr,
        },
      };
    }
    case Actions.Draft.GET_HISTORY: {
      return {
        ...state,
        draftMessageHistory: action.response.data.map(message => {
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
