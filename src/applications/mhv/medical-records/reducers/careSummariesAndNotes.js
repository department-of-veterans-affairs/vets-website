import environment from 'platform/utilities/environment';
import { Actions } from '../util/actionTypes';
import { dateFormat } from '../util/helpers';
import { testing } from '../util/constants';

const initialState = {
  /**
   * The list of care summaries and notes returned from the api
   * @type {array}
   */
  careSummariesAndNotesList: undefined,
  /**
   * The care summaries and notes currently being displayed to the user
   */
  careSummariesAndNotesDetails: undefined,
};

const convertNote = note => {
  return {
    id: note.id,
    name: note.type.coding[0].display,
    startDate: dateFormat(note.date, 'MMMM D, YYYY'),
    endDate: dateFormat(note.meta.lastUpdated, 'MMMM D, YYYY'),
    summary: note.description,
    // admittingPhysician: note.asdf,
    // dischargePhysician: note.asdf,
    // facility: note.asdf,
    // reactions: note.asdf,
  };
};

export const careSummariesAndNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CareSummariesAndNotes.GET: {
      return {
        ...state,
        careSummariesAndNotesDetails:
          environment.BUILDTYPE === 'localhost' && testing
            ? convertNote(action.response)
            : action.response,
      };
    }
    case Actions.CareSummariesAndNotes.GET_LIST: {
      return {
        ...state,
        careSummariesAndNotesList:
          environment.BUILDTYPE === 'localhost' && testing
            ? action.response.entry.map(note => {
                return convertNote(note.resource);
              })
            : action.response.map(careSummariesAndNotes => {
                return { ...careSummariesAndNotes };
              }),
      };
    }
    default:
      return state;
  }
};
