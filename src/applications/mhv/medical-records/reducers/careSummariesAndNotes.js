import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD } from '../util/constants';
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
    dateSigned: note.date ? formatDateLong(note.date) : EMPTY_FIELD,
    dateUpdated: note.meta?.lastUpdated
      ? formatDateLong(note.meta.lastUpdated)
      : EMPTY_FIELD,
    startDate: note.date ? formatDateLong(note.date) : EMPTY_FIELD,
    endDate: note.meta?.lastUpdated
      ? formatDateLong(note.meta.lastUpdated)
      : EMPTY_FIELD,
    summary:
      (isArrayAndHasItems(note.content) &&
        typeof note.content[0].attachment?.data === 'string' &&
        Buffer.from(note.content[0].attachment.data, 'base64')
          .toString()
          .split('\r')
          .filter(i => i !== '\r')
          .join('')) ||
      EMPTY_FIELD,
    location:
      (isArrayAndHasItems(note.context?.related) &&
        note.context.related[0].text) ||
      EMPTY_FIELD,
    physician:
      (isArrayAndHasItems(note.author) && note.author[0].display) ||
      EMPTY_FIELD,
    admittingPhysician:
      (isArrayAndHasItems(note.author) && note.author[0].display) ||
      EMPTY_FIELD,
    dischargePhysician:
      (isArrayAndHasItems(note.author) && note.author[0].display) ||
      EMPTY_FIELD,
    admissionDate: EMPTY_FIELD,
    dischargeDate: EMPTY_FIELD,
    admittedBy: EMPTY_FIELD,
    dischargeBy: EMPTY_FIELD,
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
        careSummariesAndNotesList:
          action.response.entry?.map(note => {
            return convertNote(note.resource);
          }) || [],
      };
    }
    case Actions.CareSummariesAndNotes.CLEAR_DETAIL: {
      return {
        ...state,
        careSummariesDetails: undefined,
      };
    }
    default:
      return state;
  }
};
