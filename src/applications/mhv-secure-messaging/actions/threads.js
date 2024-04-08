import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { getThreadList } from '../api/SmApi';

export const getListOfThreads = (
  folderId,
  pageSize,
  pageNumber,
  threadSort,
  update = false,
) => async dispatch => {
  if (!update) {
    dispatch({ type: Actions.Thread.IS_LOADING, payload: true });
  }
  try {
    const response = await getThreadList(
      folderId,
      pageSize,
      pageNumber,
      threadSort,
    );
    dispatch({
      type: Actions.Thread.GET_LIST,
      response,
    });
  } catch (e) {
    dispatch({ type: Actions.Thread.IS_LOADING, payload: false });
    if (
      e.errors &&
      e.errors[0]?.detail === 'No messages in the requested folder'
    ) {
      const noThreads = [];
      dispatch({
        type: Actions.Thread.GET_EMPTY_LIST,
        response: noThreads,
      });
    } else if (e.errors) {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          `${Constants.Alerts.Thread.GET_THREAD_ERROR} ${e.errors[0]?.detail}`,
        ),
      );
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          Constants.Alerts.Thread.GET_THREAD_ERROR,
        ),
      );
    }
  }
};

export const setThreadSortOrder = (value, folderId, page) => async dispatch => {
  dispatch({
    type: Actions.Thread.SET_SORT_ORDER,
    payload: { value, folderId, page },
  });
};

export const setThreadPage = page => async dispatch => {
  dispatch({
    type: Actions.Thread.SET_PAGE,
    payload: page,
  });
};

export const resetThreadSortOrder = () => async dispatch => {
  dispatch({
    type: Actions.Thread.RESET_SORT_ORDER,
  });
};

export const clearListOfThreads = () => async dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_LIST });
};
