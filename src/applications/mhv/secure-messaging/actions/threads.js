import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { getThreadList } from '../api/SmApi';

export const getListOfThreads = (
  folderId,
  pageSize,
  pageNumber,
  sortField,
  sortOrder,
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
      sortField,
      sortOrder,
    );
    if (response.length === 0) {
      dispatch({
        type: Actions.Thread.GET_EMPTY_LIST,
        response,
      });
    }
    dispatch({
      type: Actions.Thread.GET_LIST,
      response,
    });
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
          Constants.Alerts.Thread.GET_THREAD_ERROR,
        ),
      );
    }
  }
};

export const clearListOfThreads = () => async dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_LIST });
};
