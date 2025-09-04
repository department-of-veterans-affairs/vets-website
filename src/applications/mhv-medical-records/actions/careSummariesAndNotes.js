import {
  getNote,
  getNotes,
  getAcceleratedNotes,
  getAcceleratedNote,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getCareSummariesAndNotesList = (
  isCurrent = false,
  isAccelerating = false,
) => async dispatch => {
  dispatch({
    type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isAccelerating ? getAcceleratedNotes : getNotes;
    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: isAccelerating
        ? Actions.CareSummariesAndNotes.GET_UNIFIED_LIST
        : Actions.CareSummariesAndNotes.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getCareSummaryAndNotesDetails = (
  noteId,
  noteList,
  isAccelerating = false,
) => async dispatch => {
  try {
    await dispatchDetails(
      noteId,
      noteList,
      dispatch,
      isAccelerating ? getAcceleratedNote : getNote,
      isAccelerating
        ? Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM_FROM_LIST
        : Actions.CareSummariesAndNotes.GET_FROM_LIST,
      isAccelerating
        ? Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM
        : Actions.CareSummariesAndNotes.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearCareSummariesDetails = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.COPY_UPDATED_LIST });
};
