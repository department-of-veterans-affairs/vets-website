import { getNote, getNotes } from '../api/MrApi';
import { Actions } from '../util/actionTypes';
import { addAlert } from './alerts';
import * as Constants from '../util/constants';

export const getCareSummariesAndNotesList = () => async dispatch => {
  try {
    const response = await getNotes();
    dispatch({ type: Actions.CareSummariesAndNotes.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getCareSummaryAndNotesDetails = noteId => async dispatch => {
  try {
    const response = await getNote(noteId);
    dispatch({ type: Actions.CareSummariesAndNotes.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearCareSummariesDetails = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.CLEAR_DETAIL });
};
