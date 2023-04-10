import { Actions } from '../util/actionTypes';
import { mockGetCareSummariesAndNotesList } from '../api/MrApi';

export const getCareSummariesAndNotesList = () => async dispatch => {
  const response = await mockGetCareSummariesAndNotesList();
  dispatch({ type: Actions.CareSummariesAndNotes.GET_LIST, response });
};
