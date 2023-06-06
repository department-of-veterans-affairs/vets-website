import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * List of search results (messages)
   * @type {array}
   */
  searchResults: undefined,
  awaitingResults: false,
  keyword: '',
  searchFolder: undefined,
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
        searchFolder: action.response.folder,
        keyword: action.response.keyword,
        awaitingResults: false,
      };
    case Actions.Search.RUN_ADVANCED:
      return {
        ...state,
        searchResults: action.response.data.map(message => {
          const msgAttr = message.attributes;
          return { ...msgAttr };
        }),
        searchFolder: action.response.folder,
        keyword: action.response.keyword,
        query: action.response.query,
        awaitingResults: false,
      };
    case Actions.Search.START:
      return {
        ...state,
        searchResults: initialState.searchResults,
        awaitingResults: true,
      };
    case Actions.Search.CLEAR:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
