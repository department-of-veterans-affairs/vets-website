import { getNote, getNotes } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getCareSummariesAndNotesList = (
  isCurrent = false,
) => async dispatch => {
  dispatch({
    type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const response = await getListWithRetry(dispatch, getNotes);
    dispatch({
      type: Actions.CareSummariesAndNotes.GET_LIST,
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
) => async dispatch => {
  try {
    await dispatchDetails(
      noteId,
      noteList,
      dispatch,
      getNote,
      Actions.CareSummariesAndNotes.GET_FROM_LIST,
      Actions.CareSummariesAndNotes.GET,
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
