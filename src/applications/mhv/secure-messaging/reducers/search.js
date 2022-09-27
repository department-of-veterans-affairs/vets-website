const initialState = {
  /**
   * List of search results (messages)
   * @type {array}
   */
  searchResults: undefined,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'a':
    case 'b':
    default:
      return state;
  }
};
