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

export const getCareSummaryAndNotesDetails = (
  noteId,
  noteList,
) => async dispatch => {
  try {
    // Check if noteList has data
    if (noteList && noteList.length > 0) {
      const matchingNote = noteList.find(item => item.id === noteId);

      if (matchingNote) {
        // If a matching note is found, dispatch it
        dispatch({
          type: Actions.CareSummariesAndNotes.GET_FROM_LIST,
          response: matchingNote,
        });
        return;
      }
    } else {
      // If noteList has no data,
      // or if the noteList item can't be found, use getNote(noteId)
      const response = await getNote(noteId);
      dispatch({ type: Actions.CareSummariesAndNotes.GET, response });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearCareSummariesDetails = () => async dispatch => {
  dispatch({ type: Actions.CareSummariesAndNotes.CLEAR_DETAIL });
};
