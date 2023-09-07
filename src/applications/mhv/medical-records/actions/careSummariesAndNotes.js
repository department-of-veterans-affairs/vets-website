import { getNote, getNotes } from '../api/MrApi';
import { Actions } from '../util/actionTypes';

export const getCareSummariesAndNotesList = () => async dispatch => {
  try {
    const response = await getNotes();
    dispatch({ type: Actions.CareSummariesAndNotes.GET_LIST, response });
  } catch (error) {
    // console.error('error: ', error);
    // TODO: implement error handling
    // const err = error.errors[0];
    // dispatch({
    //   type: Actions.Alerts.ADD_ALERT,
    //   payload: {
    //     alertType: 'error',
    //     header: err.title,
    //     content: err.detail,
    //     response: err,
    //   },
    // });
  }
};

export const getCareSummaryAndNotesDetails = noteId => async dispatch => {
  try {
    const response = await getNote(noteId);
    dispatch({ type: Actions.CareSummariesAndNotes.GET, response });
  } catch (error) {
    // console.error('error: ', error);
    // TODO: implement error handling
    // const err = error.errors[0];
    // dispatch({
    //   type: Actions.Alerts.ADD_ALERT,
    //   payload: {
    //     alertType: 'error',
    //     header: err.title,
    //     content: err.detail,
    //     response: err,
    //   },
    // });
  }
};
