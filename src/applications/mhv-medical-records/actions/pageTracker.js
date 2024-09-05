import { Actions } from '../util/actionTypes';

export const setPageNumber = pageNumber => async dispatch => {
  dispatch({
    type: Actions.PageTracker.SET_PAGE_TRACKER,
    payload: pageNumber,
  });
};

export const clearPageNumber = () => async dispatch => {
  dispatch({
    type: Actions.PageTracker.CLEAR_PAGE_TRACKER,
  });
};
