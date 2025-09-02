import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { format } from 'date-fns';
import { Actions } from '../util/actionTypes';
import {
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
    const reference = record.context?.related?.find(item => item.reference)
      ?.reference;
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

export const getDateSigned = (record, noteSummary = null) => {
  let dateSigned = record.attributes?.dateSigned;
  if (!dateSigned && isArrayAndHasItems(record.authenticator?.extension)) {
    const ext = record.authenticator.extension.find(e => e.valueDateTime);
    if (ext) {
      dateSigned = ext.valueDateTime;
      // const formattedDate = formatDateLong(ext.valueDateTime);
      // return formattedDate !== 'Invalid date' ? formattedDate : null;
    }
  }

  if (!dateSigned && noteSummary) {
    // OH doesn't include date signed in the authenticator, so it'll need to be extracted from the note body
    // TODO: verify note structure once parsed - not sure this will work :/
    dateSigned =
      noteSummary
        ?.split('signed on:')[1]
        ?.split('\n')[0]
        ?.trim() || null;
  }
  const formattedDate = formatDateLong(dateSigned);
  return formattedDate !== 'Invalid date' ? formattedDate : null;
  // return null;
};

export const getAttending = noteSummary => {
  return (
    noteSummary
      ?.split('ATTENDING:')[1]
      ?.split('\n')[0]
      ?.trim() || null
  );
};

const isValidDate = d => {
  return d instanceof Date && !Number.isNaN(d.getTime());
};

export const getDateFromBody = (noteSummary, label) => {
  const dateStr =
    noteSummary
      ?.split(label)[1]
      ?.split('\n')[0]
      ?.trim() || null;
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
    if (record?.type?.coding.some(coding => coding.code === code)) {
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
  const dateTime = new Date(datetimeString);
  if (Number.isNaN(dateTime.getTime())) {
    return { formattedDate: '', formattedTime: '' };
  }
  const formattedDate = format(dateTime, 'MMMM d, yyyy');
  const formattedTime = format(dateTime, 'h:mm a');

  return { formattedDate, formattedTime };
}

const convertUnifiedCareSummariesAndNotesRecord = record => {
  const formattedNoteDate = formatDateTime(record.attributes.date);
  const noteDate = formattedNoteDate
    ? `${formattedNoteDate.formattedDate}, ${formattedNoteDate.formattedTime}`
    : '';
  const note = decodeBase64Report(record.attributes.note);
  const admissionDateRaw = getAdmissionDate(record, note);
  const dischargeDateRaw = getDischargeDate(record, note);

  const formattedAdmissionDate = formatDateTime(admissionDateRaw);
  const admissionDate = formattedAdmissionDate
    ? `${formattedAdmissionDate.formattedDate}, ${
        formattedAdmissionDate.formattedTime
      }`
    : '';
  const formattedDischargeDate = formatDateTime(dischargeDateRaw);
  const dischargedDate = formattedDischargeDate
    ? `${formattedDischargeDate.formattedDate}, ${
        formattedDischargeDate.formattedTime
      }`
    : '';
  const entryType = getRecordTypeFromLoincCodes(record.attributes.loincCodes); // record.attributes.noteType
  return {
    id: record.id,
    name: record.attributes.name || EMPTY_FIELD,
    type: entryType || EMPTY_FIELD, // noteType or get from LOINC codes
    loincCodes: record.attributes.loincCodes || [],
    date: noteDate || EMPTY_FIELD,
    dateSigned: getDateSigned(record, note) || EMPTY_FIELD, // TODO: OH will have this but VistA won't unless we can extract?
    writtenBy: record.attributes.writtenBy || EMPTY_FIELD,
    signedBy: record.attributes.signedBy || EMPTY_FIELD,
    location: record.attributes.location || EMPTY_FIELD,
    note,
    dischargedBy: record.attributes.writtenBy || EMPTY_FIELD, // This is mapped to the author
    admissionDate,
    dischargedDate,
    summary: record.attributes.note || EMPTY_FIELD, // record.attributes.note
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
    case Actions.CareSummariesAndNotes.GET_FROM_LIST: {
      return {
        ...state,
        careSummariesAndNotesDetails: action.response,
      };
    }
    case Actions.CareSummariesAndNotes.GET_UNIFIED_LIST: {
      const data = action.response || [];
      const oldList = state.careSummariesAndNotesList;
      const newList =
        data
          ?.map(note => {
            return convertUnifiedCareSummariesAndNotesRecord(note);
          }) // .filter(record => record.type !== noteTypes.OTHER)
          .sort((a, b) => {
            if (!a.sortByDate) return 1; // Push nulls to the end
            if (!b.sortByDate) return -1; // Keep non-nulls at the front
            return b.sortByDate.getTime() - a.sortByDate.getTime();
          }) || [];
      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        careSummariesAndNotesList:
          typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.CareSummariesAndNotes.GET_LIST: {
      const oldList = state.careSummariesAndNotesList;
      const newList =
        action.response.entry
          ?.map(note => {
            return convertCareSummariesAndNotesRecord(note.resource);
          })
          .filter(record => record.type !== noteTypes.OTHER)
          .sort((a, b) => {
            if (!a.sortByDate) return 1; // Push nulls to the end
            if (!b.sortByDate) return -1; // Keep non-nulls at the front
            return b.sortByDate.getTime() - a.sortByDate.getTime();
          }) || [];
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
    default:
      return state;
  }
};
