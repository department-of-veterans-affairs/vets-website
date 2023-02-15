// import { Actions } from '../util/actionTypes';
import {
  moveThread as moveThreadCall,
  deleteThread as deleteThreadCall,
} from '../api/SmApi';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const moveThread = (threadId, toFolderId) => async dispatch => {
  try {
    await moveThreadCall(threadId, toFolderId);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Thread.MOVE_THREAD_SUCCESS,
      ),
    );
  } catch (e) {
    dispatch(addAlert('', '', ''));
    throw e;
  }
};

export const deleteThread = threadId => async dispatch => {
  try {
    await deleteThreadCall(threadId);
    dispatch(
      addAlert(
        Constants.ALERT_TYPE_SUCCESS,
        '',
        Constants.Alerts.Thread.DELETE_THREAD_SUCCESS,
      ),
    );
  } catch (e) {
    // const error = e.errors[0].detail;
    dispatch(addAlert('', '', ''));
    throw e;
  }
};
