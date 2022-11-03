import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * List of search results (messages)
   * @type {array}
   */
  searchResults: undefined,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Search.RUN_BASIC:
      return {
        ...state,
        searchResults: action.response.data.map(message => {
          const msgAttr = message.attributes;
          return { ...msgAttr };
        }),
        folder: action.response.folder,
        keyword: action.response.keyword,
      };
    case Actions.Search.RUN_ADVANCED:
      return {
        ...state,
        searchResults: action.response.data.map(message => {
          const msgAttr = message.attributes;
          return { ...msgAttr };
        }),
        folder: action.response.folder,
        keyword: '',
        query: action.response.query,
      };
    case Actions.Search.CLEAR:
      return {
        ...state,
        searchResults: initialState.searchResults,
      };
    default:
      return state;
  }
};
