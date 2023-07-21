import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { emptyField } from '../util/constants';

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
    name: note.type.text || note.type.coding[0].display,
    type: note.type.coding[0].code,
    dateSigned: formatDateLong(note.date),
    dateUpdated: formatDateLong(note.meta.lastUpdated),
    startDate: formatDateLong(note.date),
    endDate: formatDateLong(note.meta.lastUpdated),
    summary: Buffer.from(note.content[0].attachment.data, 'base64').toString(),
    location: note.context.related[0].text || emptyField,
    physician: note.author[0].display || emptyField,
    admittingPhysician: note.author[0].display || emptyField,
    dischargePhysician: note.author[0].display || emptyField,
  };
};

export const careSummariesAndNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CareSummariesAndNotes.GET: {
      return {
        ...state,
        careSummariesAndNotesDetails: convertNote(action.response),
      };
    }
    case Actions.CareSummariesAndNotes.GET_LIST: {
      return {
        ...state,
        careSummariesAndNotesList: action.response.entry.map(note => {
          return convertNote(note.resource);
        }),
      };
    }
    default:
      return state;
  }
};
