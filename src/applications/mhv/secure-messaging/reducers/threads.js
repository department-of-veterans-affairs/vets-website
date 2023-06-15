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
  },
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
      };
    case Actions.Thread.GET_EMPTY_LIST:
      return {
        ...state,
        threadList: action.response,
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
    case Actions.Thread.RESET_SORT_ORDER:
      return {
        ...state,
        threadSort: initialState.threadSort,
      };
    default:
      return state;
  }
};
