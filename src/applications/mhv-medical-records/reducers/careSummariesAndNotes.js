import { format } from 'date-fns';

import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import {
  DEFAULT_DATE_RANGE,
  EMPTY_FIELD,
  loincCodes,
  noteTypes,
  loadStates,
  dischargeSummarySortFields,
} from '../util/constants';
import {
  extractContainedResource,
  isArrayAndHasItems,
  decodeBase64Report,
  formatNameFirstToLast,
  buildInitialDateRange,
} from '../util/helpers';

const initialState = {
  /**
   * The last time that the list was fetched and known to be up-to-date
   * @type {Date}
   */
  listCurrentAsOf: undefined,
  /**
   * PRE_FETCH, FETCHING, FETCHED
   */
  listState: loadStates.PRE_FETCH,

  /**
   * The list of care summaries and notes returned from the api
   * @type {Array}
   */
  careSummariesAndNotesList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The care summaries and notes currently being displayed to the user
   */
  careSummariesAndNotesDetails: undefined,
  /**
   * The date range currently being displayed to the user
   */
  dateRange: buildInitialDateRange(DEFAULT_DATE_RANGE),
};

export const getTitle = record => {
  const contentItem = record.content?.find(item => item.attachment);
  if (contentItem?.attachment?.title) {
    return contentItem.attachment.title;
  }
  if (isArrayAndHasItems(record.type?.coding)) {
    const codingItem = record.type.coding.find(item => item.display);
    return codingItem?.display ?? null;
  }
  return null;
};

export const getType = record => {
  if (isArrayAndHasItems(record.type?.coding)) {
    const codingItem = record.type?.coding.find(item => item.code);
    return codingItem?.code ?? null;
  }
  return null;
};

export const extractAuthenticator = record => {
  const authenticator = extractContainedResource(
    record,
    record.authenticator?.reference,
  );
  const name = authenticator?.name?.find(item => item.text);
  return formatNameFirstToLast(name) ?? null;
};

export const extractAuthor = record => {
  if (isArrayAndHasItems(record.author)) {
    const authorRef = record.author.find(item => item.reference);
    const author = extractContainedResource(record, authorRef?.reference);
    const name = author?.name?.find(item => item.text);
    return formatNameFirstToLast(name) ?? null;
  }
  return null;
};

export const extractLocation = record => {
  if (isArrayAndHasItems(record?.context?.related)) {
    const reference = record.context?.related?.find(
      item => item.reference,
    )?.reference;
    if (reference) {
      const resource = extractContainedResource(record, reference);
      return resource?.name ?? null;
    }
  }
  return null;
};

export const getNote = record => {
  if (isArrayAndHasItems(record.content)) {
    const contentItem = record.content.find(item => item.attachment);
    return decodeBase64Report(contentItem?.attachment?.data);
  }
  return null;
};

export const getDateSigned = record => {
  if (isArrayAndHasItems(record.authenticator?.extension)) {
    const ext = record.authenticator.extension.find(e => e.valueDateTime);
    if (ext) {
      const formattedDate = formatDateLong(ext.valueDateTime);
      return formattedDate !== 'Invalid date' ? formattedDate : null;
    }
  }
  return null;
};

export const getAttending = noteSummary => {
  if (typeof noteSummary !== 'string') return null;
  return (
    noteSummary?.split('ATTENDING:')?.[1]?.split('\n')?.[0]?.trim() || null
  );
};

const isValidDate = d => {
  return d instanceof Date && !Number.isNaN(d.getTime());
};

export const getDateFromBody = (noteSummary, label) => {
  if (typeof noteSummary !== 'string' || typeof label !== 'string') return null;
  if (noteSummary.length === 0 || label.length === 0) return null;
  const dateStr =
    noteSummary?.split(label)?.[1]?.split('\n')?.[0]?.trim() || null;
  const date = dateStr ? new Date(dateStr) : null;
  return isValidDate(date) ? date : null;
};

export const getAdmissionDate = (record, noteSummary) => {
  let admissionDate = record.context?.period?.start
    ? new Date(record.context.period.start)
    : null;
  if (!admissionDate) {
    // TODO: this probably won't work for new note structure
    admissionDate = getDateFromBody(noteSummary, 'DATE OF ADMISSION:');
  }
  return admissionDate;
};

export const getDischargeDate = (record, noteSummary) => {
  // OH data will have this, VistA data won't
  let dischargeDate = record.attributes?.dischargeDate;
  if (!dischargeDate && record.context?.period?.end) {
    dischargeDate = record.context?.period?.end
      ? new Date(record.context.period.end)
      : null;
  }
  if (!dischargeDate) {
    // TODO: this probably won't work for new note structure
    dischargeDate = getDateFromBody(noteSummary, 'DATE OF DISCHARGE:');
  }
  return dischargeDate;
};

export const convertAdmissionAndDischargeDetails = record => {
  const summary = getNote(record);

  const admissionDate = getAdmissionDate(record, summary);
  const dischargeDate = getDischargeDate(record, summary);
  const dateEntered = record.date ? new Date(record.date) : null;

  const sortByDate = admissionDate || dischargeDate || dateEntered;
  let sortByField = null;
  if (admissionDate) {
    sortByField = dischargeSummarySortFields.ADMISSION_DATE;
  } else if (dischargeDate) {
    sortByField = dischargeSummarySortFields.DISCHARGE_DATE;
  } else if (dateEntered) {
    sortByField = dischargeSummarySortFields.DATE_ENTERED;
  }

  return {
    id: record.id,
    name: getTitle(record),
    type: getType(record),
    admissionDate: admissionDate ? formatDateLong(admissionDate) : EMPTY_FIELD,
    dischargeDate: dischargeDate ? formatDateLong(dischargeDate) : EMPTY_FIELD,
    dischargedBy: extractAuthor(record) || EMPTY_FIELD,
    dateEntered: dateEntered ? formatDateLong(dateEntered) : EMPTY_FIELD,
    admittedBy: getAttending(summary) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    summary: summary || EMPTY_FIELD,
    sortByDate,
    sortByField,
  };
};

const convertProgressNote = record => {
  return {
    id: record.id || null,
    name: getTitle(record) || EMPTY_FIELD,
    type: getType(record),
    date: record.date ? formatDateLong(record.date) : EMPTY_FIELD,
    dateSigned: getDateSigned(record) || EMPTY_FIELD,
    writtenBy: extractAuthor(record) || EMPTY_FIELD,
    signedBy: extractAuthenticator(record) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    note: getNote(record) || EMPTY_FIELD,
    sortByDate: record.date ? new Date(record.date) : null,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the type of note/summary that was passed
 */
export const getRecordType = record => {
  const typeMapping = {
    [loincCodes.DISCHARGE_SUMMARY]: noteTypes.DISCHARGE_SUMMARY,
    [loincCodes.PHYSICIAN_PROCEDURE_NOTE]: noteTypes.PHYSICIAN_PROCEDURE_NOTE,
    [loincCodes.CONSULT_RESULT]: noteTypes.CONSULT_RESULT,
  };

  for (const [code, noteType] of Object.entries(typeMapping)) {
    if (record?.type?.coding?.some(coding => coding.code === code)) {
      return noteType;
    }
  }

  return noteTypes.OTHER;
};

export const getRecordTypeFromLoincCodes = codes => {
  const typeMapping = {
    [loincCodes.DISCHARGE_SUMMARY]: noteTypes.DISCHARGE_SUMMARY,
    [loincCodes.PHYSICIAN_PROCEDURE_NOTE]: noteTypes.PHYSICIAN_PROCEDURE_NOTE,
    [loincCodes.CONSULT_RESULT]: noteTypes.CONSULT_RESULT,
  };

  for (const [code, noteType] of Object.entries(typeMapping)) {
    if (codes.includes(code)) {
      return noteType;
    }
  }

  return noteTypes.OTHER;
};

/**
 * Maps each record type to a converter function
 */
const notesAndSummariesConverterMap = {
  [noteTypes.DISCHARGE_SUMMARY]: convertAdmissionAndDischargeDetails,
  [noteTypes.PHYSICIAN_PROCEDURE_NOTE]: convertProgressNote,
  [noteTypes.CONSULT_RESULT]: convertProgressNote,
};
// TODO: this is wet
// TODO: need to adjust to handle the different formats
// OH uses UTC ('2025-07-29T17:32:46.000Z'), VistA uses TZ offset ('2024-10-18T11:52:00+00:00')
export function formatDateTime(datetimeString) {
  if (!datetimeString) return null;
  const dateTime = new Date(datetimeString);
  if (Number.isNaN(dateTime.getTime())) {
    return null;
  }
  const formattedDate = format(dateTime, 'MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return `${formattedDate}, ${formattedTime}`;
}

export const convertUnifiedCareSummariesAndNotesRecord = record => {
  const formattedNoteDate = formatDateTime(record.attributes.date);

  const note = decodeBase64Report(record.attributes.note);

  const formattedAdmissionDate = formatDateTime(
    record.attributes.admissionDate,
  );

  const formattedDischargeDate = formatDateTime(
    record.attributes.dischargedDate,
  );

  const formattedDateEntered = formatDateTime(record.attributes.dateEntered);

  const formattedDateSigned = formatDateTime(record.attributes.dateSigned);

  return {
    id: record.id,
    name: record.attributes.name || EMPTY_FIELD,
    type: record.attributes.noteType || EMPTY_FIELD,
    loincCodes: record.attributes.loincCodes || [],
    date: formattedNoteDate || EMPTY_FIELD,
    writtenBy: record.attributes.writtenBy || EMPTY_FIELD,
    signedBy: record.attributes.signedBy || EMPTY_FIELD,
    location: record.attributes.location || EMPTY_FIELD,
    note,
    dischargedBy: record.attributes.writtenBy || EMPTY_FIELD, // This is mapped to the author
    summary: note || EMPTY_FIELD,
    admittedBy: getAttending(note) || EMPTY_FIELD,
    dischargedDate: formattedDischargeDate || EMPTY_FIELD,
    admissionDate: formattedAdmissionDate || EMPTY_FIELD,
    dateSigned: formattedDateSigned || EMPTY_FIELD,
    dateEntered: formattedDateEntered || formattedNoteDate || EMPTY_FIELD,
    sortByDate: new Date(record.attributes.date),
  };
};
/**
 * @param {Object} record - A FHIR DocumentReference object
 * @returns the appropriate frontend object for display
 */
export const convertCareSummariesAndNotesRecord = record => {
  const type = getRecordType(record);
  const convertRecord = notesAndSummariesConverterMap[type];
  return convertRecord
    ? convertRecord(record)
    : { ...record, type: noteTypes.OTHER };
};

export const careSummariesAndNotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.CareSummariesAndNotes.GET: {
      return {
        ...state,
        careSummariesAndNotesDetails: convertCareSummariesAndNotesRecord(
          action.response,
        ),
      };
    }
    case Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM: {
      return {
        ...state,
        careSummariesAndNotesDetails: convertUnifiedCareSummariesAndNotesRecord(
          action.response.data,
        ),
      };
    }
    case Actions.CareSummariesAndNotes.GET_UNIFIED_ITEM_FROM_LIST: {
      return {
        ...state,
        careSummariesAndNotesDetails: action.response.data.id
          ? convertUnifiedCareSummariesAndNotesRecord(action.response.data)
          : { ...action.response.data },
      };
    }
    case Actions.CareSummariesAndNotes.GET_FROM_LIST: {
      return {
        ...state,
        careSummariesAndNotesDetails: action.response,
      };
    }
    case Actions.CareSummariesAndNotes.GET_UNIFIED_LIST: {
      // Harden: ensure we always have an array before mapping/sorting to avoid TypeErrors
      const data = Array.isArray(action.response?.data)
        ? action.response.data
        : [];
      const newList = data
        .map(note => convertUnifiedCareSummariesAndNotesRecord(note))
        .sort((a, b) => {
          if (!a.sortByDate) return 1; // Push nulls to the end
          if (!b.sortByDate) return -1; // Keep non-nulls at the front
          return b.sortByDate.getTime() - a.sortByDate.getTime();
        });
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        careSummariesAndNotesList: newList,
      };
    }
    case Actions.CareSummariesAndNotes.GET_LIST: {
      const oldList = state.careSummariesAndNotesList;
      // Harden: coerce entry list to array before chaining map/filter/sort
      const fhirEntry = Array.isArray(action.response?.entry)
        ? action.response.entry
        : [];
      const newList = fhirEntry
        .map(note => convertCareSummariesAndNotesRecord(note.resource))
        .filter(record => record.type !== noteTypes.OTHER)
        .sort((a, b) => {
          if (!a.sortByDate) return 1; // Push nulls to the end
          if (!b.sortByDate) return -1; // Keep non-nulls at the front
          return b.sortByDate.getTime() - a.sortByDate.getTime();
        });
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        careSummariesAndNotesList:
          typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.CareSummariesAndNotes.COPY_UPDATED_LIST: {
      const originalList = state.careSummariesAndNotesList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          careSummariesAndNotesList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.CareSummariesAndNotes.CLEAR_DETAIL: {
      return {
        ...state,
        careSummariesAndNotesDetails: undefined,
      };
    }
    case Actions.CareSummariesAndNotes.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    case Actions.CareSummariesAndNotes.SET_DATE_RANGE: {
      return {
        ...state,
        dateRange: action.payload,
      };
    }
    default:
      return state;
  }
};
