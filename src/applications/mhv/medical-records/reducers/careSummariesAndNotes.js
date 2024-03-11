import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import { EMPTY_FIELD, loincCodes, noteTypes } from '../util/constants';
import { extractContainedResource, isArrayAndHasItems } from '../util/helpers';

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
  return name?.text ?? null;
};

export const extractAuthor = record => {
  if (isArrayAndHasItems(record.author)) {
    const authorRef = record.author.find(item => item.reference);
    const author = extractContainedResource(record, authorRef?.reference);
    const name = author?.name?.find(item => item.text);
    return name?.text ?? null;
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
    if (contentItem && typeof contentItem.attachment?.data === 'string') {
      return Buffer.from(contentItem.attachment.data, 'base64')
        .toString('utf-8')
        .replace(/\r\n|\r/g, '\n'); // Standardize line endings
    }
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
  return (
    noteSummary
      ?.split('ATTENDING:')[1]
      ?.split('\n')[0]
      ?.trim() || null
  );
};

const convertAdmissionAndDischargeDetails = record => {
  const summary = getNote(record);

  return {
    id: record.id,
    name: getTitle(record),
    type: getType(record),
    admissionDate: record.context?.period?.start
      ? formatDateLong(record.context.period.start)
      : EMPTY_FIELD,
    dischargeDate: record.context?.period?.end
      ? formatDateLong(record.context.period.end)
      : EMPTY_FIELD,
    admittedBy: getAttending(summary) || EMPTY_FIELD,
    dischargedBy: extractAuthor(record) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    summary: summary || EMPTY_FIELD,
  };
};

const convertProgressNote = record => {
  return {
    id: record.id || null,
    name: getTitle(record) || EMPTY_FIELD,
    type: getType(record),
    date: record.date ? formatDateLong(record.date) : EMPTY_FIELD,
    dateSigned: getDateSigned(record) || EMPTY_FIELD,
    signedBy: extractAuthor(record) || EMPTY_FIELD,
    coSignedBy: extractAuthenticator(record) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    note: getNote(record) || EMPTY_FIELD,
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

/**
 * Maps each record type to a converter function
 */
const notesAndSummariesConverterMap = {
  [noteTypes.DISCHARGE_SUMMARY]: convertAdmissionAndDischargeDetails,
  [noteTypes.PHYSICIAN_PROCEDURE_NOTE]: convertProgressNote,
  [noteTypes.CONSULT_RESULT]: convertProgressNote,
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
    case Actions.CareSummariesAndNotes.GET_LIST: {
      return {
        ...state,
        careSummariesAndNotesList:
          action.response.entry
            ?.map(note => {
              return convertCareSummariesAndNotesRecord(note.resource);
            })
            .filter(record => record.type !== noteTypes.OTHER) || [],
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
