import { Actions } from '../util/actionTypes';

const initialState = {
  /**
   * The lab or test result currently being displayed to the user
   */
  pageNumber: null,
};

export const pageTrackerReducer = (state = initialState, { type, payload }) => {
  if (type === Actions.PageTracker.SET_PAGE_TRACKER) {
    return {
      ...state,
      pageNumber: payload,
    };
  }
  if (type === Actions.PageTracker.CLEAR_PAGE_TRACKER) {
    return {
      ...state,
      pageNumber: null,
    };
  }
  return state;
};
