const initialState = {
  /**
   * The draft message that the user is currently composing
   */
  draftMessage: undefined,
  /**
   * The message thread for the current draft message
   * @type {array}
   */
  draftMessageThread: undefined,
};

export const draftDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'a':
    case 'b':
    default:
      return state;
  }
};
