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
    dispatch({ type: Actions.Thread.CLEAR_LIST });
  }
  try {
    const response = await getThreadList(
      folderId,
      pageSize,
      pageNumber,
      threadSort,
    );
    if (response.length === 0) {
      dispatch({
        type: Actions.Thread.GET_EMPTY_LIST,
        response,
      });
    } else {
      dispatch({
        type: Actions.Thread.GET_LIST,
        response,
      });
    }
  } catch (e) {
    if (e.errors[0].detail === 'No messages in the requested folder') {
      const noThreads = [];
      dispatch({
        type: Actions.Thread.GET_EMPTY_LIST,
        response: noThreads,
      });
    } else {
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          `${Constants.Alerts.Thread.GET_THREAD_ERROR}. ${e.errors[0].detail}`,
        ),
      );
    }
  }
};

export const setThreadSortOrder = (sortValue, folderId) => async dispatch => {
  dispatch({
    type: Actions.Thread.SET_SORT_ORDER,
    payload: { value: sortValue, folderId },
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
