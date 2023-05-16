import { getNote, getNotes } from '../api/MrApi';
import { Actions } from '../util/actionTypes';

export const getCareSummariesAndNotesList = () => async dispatch => {
  const response = await getNotes();
  dispatch({ type: Actions.CareSummariesAndNotes.GET_LIST, response });
};

export const getCareSummaryAndNotesDetails = noteId => async dispatch => {
  const response = await getNote(noteId);
  dispatch({ type: Actions.CareSummariesAndNotes.GET, response });
};
