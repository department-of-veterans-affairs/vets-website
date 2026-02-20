import {
  getNote,
  getNotes,
  getAcceleratedNotes,
  getAcceleratedNote,
} from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getCareSummariesAndNotesList = (
  isCurrent = false,
  isAccelerating = false,
  timeframe = {},
) => async dispatch => {
  dispatch({
    type: Actions.CareSummariesAndNotes.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isAccelerating
      ? () => getAcceleratedNotes(timeframe)
      : getNotes;
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
    sendDatadogError(
      error,
      'actions_careSummariesAndNotes_getCareSummariesAndNotesList',
    );
  }
};

export const getCareSummaryAndNotesDetails = (
  noteId,
  noteList,
  isAccelerating = false,
) => async dispatch => {
  const matchingNote = noteList && noteList.find(item => item.id === noteId);
  const isOracleHealth = matchingNote?.source === 'oracle-health';

  try {
    if (isAccelerating) {
      if (!matchingNote) return;

      if (isOracleHealth) {
        // Oracle Health notes don't have full details in the list response,
        // so we must call the single-note API to fetch them.
        const response = await getAcceleratedNote(noteId, matchingNote.source);
        dispatch({
          type: Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM_FROM_LIST,
          response,
        });
      } else {
        // Vista notes already have full details in the list response
        dispatch({
          type: Actions.CareSummariesAndNotes.GET_FROM_LIST,
          response: matchingNote,
        });
      }
    } else {
      await dispatchDetails(
        noteId,
        noteList,
        dispatch,
        getNote,
        Actions.CareSummariesAndNotes.GET_FROM_LIST,
        Actions.CareSummariesAndNotes.GET,
      );
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    sendDatadogError(
      error,
      'actions_careSummariesAndNotes_getCareSummaryAndNotesDetails',
    );
  }
};

export const clearCareSummariesDetails = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.COPY_UPDATED_LIST });
};

export const updateNotesDateRange = (
  option,
  fromDate,
  toDate,
) => async dispatch => {
  dispatch({
    type: Actions.CareSummariesAndNotes.SET_DATE_RANGE,
    payload: {
      option,
      fromDate,
      toDate,
    },
  });
};
