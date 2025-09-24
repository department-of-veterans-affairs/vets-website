import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { getThreadList } from '../api/SmApi';

export const setThreadSortOrder = ({
  value,
  folderId,
  page,
}) => async dispatch => {
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

export const setThreadRefetchRequired = value => async dispatch => {
  dispatch({
    type: Actions.Thread.RE_FETCH_REQUIRED,
    payload: value,
  });
};

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
    let response = await getThreadList({
      folderId,
      pageSize,
      pageNumber,
      threadSort,
    });
    if (response.data.length === 0 && pageNumber > 1) {
      // in a scenario when the last thread on a page is deleted,
      // we need to decrement the page number and update thread list
      const decrementPage = pageNumber - 1;
      dispatch(setThreadPage(decrementPage));
      response = await getThreadList({
        folderId,
        pageSize,
        decrementPage,
        threadSort,
      });
    }
    dispatch({
      type: Actions.Thread.GET_LIST,
      response,
    });
  } catch (e) {
    if (
      e.errors &&
      e.errors[0]?.detail === 'No messages in the requested folder'
    ) {
      dispatch({ type: Actions.Thread.IS_LOADING, payload: false });
      const noThreads = [];
      dispatch({
        type: Actions.Thread.GET_EMPTY_LIST,
        response: noThreads,
      });
    } else if (e.errors) {
      dispatch({
        type: Actions.Thread.ERROR_LOADING_LIST,
        response: { errors: e.errors },
      });
      dispatch({ type: Actions.Thread.IS_LOADING, payload: false });
      dispatch(
        addAlert(
          Constants.ALERT_TYPE_ERROR,
          '',
          `${Constants.Alerts.Thread.GET_THREAD_ERROR} ${e.errors[0]?.detail}`,
        ),
      );
    } else {
      dispatch({ type: Actions.Thread.IS_LOADING, payload: false });
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
