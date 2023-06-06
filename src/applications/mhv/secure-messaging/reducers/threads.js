import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The list of threads being displayed in the folder view/inbox
   * @type {array}
   */
  threadList: undefined,
  threadListTotalCount: undefined,
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
    default:
      return state;
  }
};
