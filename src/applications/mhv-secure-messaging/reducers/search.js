import { Actions } from '../util/actionTypes';
import { threadSortingOptions } from '../util/constants';

const initialState = {
  /**
   * List of search results (messages)
   * @type {array}
   */
  searchResults: undefined,
  awaitingResults: false,
  keyword: '',
  searchFolder: undefined,
  searchSort: threadSortingOptions.SENT_DATE_DESCENDING.value,
  query: undefined,
  page: 1,
};

export const searchReducer = (state = initialState, action) => {
  switch (action.type) {
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
    case Actions.Search.SET_SORT:
      return {
        ...state,
        searchSort: action.payload,
      };
    case Actions.Search.SET_PAGE:
      return {
        ...state,
        page: action.payload,
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
