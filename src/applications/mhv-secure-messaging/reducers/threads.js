import { Actions } from '../util/actionTypes';
import { threadSortingOptions } from '../util/constants';

const initialState = {
  /**
   * The list of threads being displayed in the folder view/inbox
   * @type {array}
   */
  threadList: undefined,
  threadListTotalCount: undefined,
  threadSort: {
    value: threadSortingOptions.SENT_DATE_DESCENDING.value,
    folderId: undefined,
    page: 1,
  },
  isLoading: false,
  refetchRequired: false,
};

export const threadsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Thread.GET_LIST:
      return {
        ...state,
        threadList: action.response.data.map(thread => {
          const thrdAttr = thread.attributes;
          return { ...thrdAttr };
        }),
        isLoading: false,
        refetchRequired: false,
      };
    case Actions.Thread.GET_EMPTY_LIST:
      return {
        ...state,
        threadList: action.response,
        isLoading: false,
      };
    case Actions.Thread.CLEAR_LIST:
      return {
        ...state,
        threadList: initialState.threadList,
      };
    case Actions.Thread.SET_SORT_ORDER:
      return {
        ...state,
        threadSort: action.payload,
      };
    case Actions.Thread.SET_PAGE:
      return {
        ...state,
        threadSort: {
          ...state.threadSort,
          page: action.payload,
        },
      };
    case Actions.Thread.RESET_SORT_ORDER:
      return {
        ...state,
        threadSort: initialState.threadSort,
      };
    case Actions.Thread.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case Actions.Thread.ERROR_LOADING_LIST:
      return {
        ...state,
        threadList: undefined,
        isLoading: false,
        hasError: true,
        error: action.response.errors,
      };
    case Actions.Thread.RE_FETCH_REQUIRED:
      return {
        ...state,
        refetchRequired: action.payload,
      };
    case Actions.Thread.SET_TOTAL_COUNT:
    default:
      return state;
  }
};
