import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { emptyField } from '../util/constants';
import { isArrayAndHasItems } from '../util/helpers';

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

/**
 * Convert the FHIR note resource from the backend into the appropriate model.
 * @param {Object} note a FHIR DocumentReference resource
 * @returns a note object that this application can use, or null if the param is null/undefined
 */
export const convertNote = note => {
  if (typeof note === 'undefined' || note === null) {
    return null;
  }
  return {
    id: note.id,
    name:
      note.type?.text ||
      (isArrayAndHasItems(note.type?.coding) && note.type.coding[0].display),
    type: isArrayAndHasItems(note.type?.coding) && note.type.coding[0].code,
    dateSigned: formatDateLong(note.date),
    dateUpdated: formatDateLong(note.meta.lastUpdated),
    startDate: formatDateLong(note.date),
    endDate: formatDateLong(note.meta.lastUpdated),
    summary:
      (isArrayAndHasItems(note.content) &&
        typeof note.content[0].attachment?.data === 'string' &&
        Buffer.from(note.content[0].attachment.data, 'base64')
          .toString()
          .split('\r')
          .filter(i => i !== '\r')
          .join('')) ||
      emptyField,
    location:
      (isArrayAndHasItems(note.context?.related) &&
        note.context.related[0].text) ||
      emptyField,
    physician:
      (isArrayAndHasItems(note.author) && note.author[0].display) || emptyField,
    admittingPhysician:
      (isArrayAndHasItems(note.author) && note.author[0].display) || emptyField,
    dischargePhysician:
      (isArrayAndHasItems(note.author) && note.author[0].display) || emptyField,
    admissionDate: emptyField,
    dischargeDate: emptyField,
    admittedBy: emptyField,
    dischargeBy: emptyField,
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
