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

const extractName = record => {
  return (
    isArrayAndHasItems(record.type?.coding) && record.type.coding[0].display
  );
};

const extractType = record => {
  return isArrayAndHasItems(record.type?.coding) && record.type.coding[0].code;
};

const extractAuthenticator = record => {
  return extractContainedResource(record, record.authenticator?.reference)
    ?.name[0].text;
};

const extractAuthor = record => {
  return extractContainedResource(
    record,
    isArrayAndHasItems(record.author) && record.author[0].reference,
  )?.name[0].text;
};

const extractLocation = record => {
  return (
    record.content?.period?.location ||
    (isArrayAndHasItems(record.contained) &&
      record.contained.find(item => item.resourceType === 'Location')?.name)
  );
};

const extractNote = record => {
  return (
    isArrayAndHasItems(record.content) &&
    typeof record.content[0].attachment?.data === 'string' &&
    Buffer.from(record.content[0].attachment.data, 'base64')
      .toString('utf-8')
      .replace(/\r\n|\r/g, '\n') // Standardize line endings
  );
};

const convertAdmissionAndDischargeDetails = record => {
  const summary = extractNote(record) || EMPTY_FIELD;

  return {
    id: record.id,
    name: extractName(record),
    type: extractType(record),
    admissionDate: record.context?.period?.start
      ? formatDateLong(record.context?.period?.start)
      : EMPTY_FIELD,
    dischargeDate: record.context?.period?.end
      ? formatDateLong(record.context?.period?.end)
      : EMPTY_FIELD,
    admittedBy: summary
      .split('ATTENDING:')[1]
      .split('\n')[0]
      .trim(),
    dischargedBy: extractAuthor(record) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    summary: summary || EMPTY_FIELD,
  };
};

const convertProgressNote = record => {
  return {
    id: record.id,
    name: extractName(record),
    type: extractType(record),
    dateSigned: record.date ? formatDateLong(record.date) : EMPTY_FIELD,
    signedBy: extractAuthor(record) || EMPTY_FIELD,
    coSignedBy: extractAuthenticator(record) || EMPTY_FIELD,
    location: extractLocation(record) || EMPTY_FIELD,
    note: extractNote(record) || EMPTY_FIELD,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the type of note/summary that was passed
 */
const getRecordType = record => {
  if (
    record?.type?.coding.some(
      coding => coding.code === loincCodes.DISCHARGE_SUMMARY,
    )
  ) {
    return noteTypes.DISCHARGE_SUMMARY;
  }
  if (
    record?.type?.coding.some(
      coding => coding.code === loincCodes.PHYSICIAN_PROCEDURE_NOTE,
    )
  ) {
    return noteTypes.PHYSICIAN_PROCEDURE_NOTE;
  }
  return noteTypes.OTHER;
};

/**
 * Maps each record type to a converter function
 */
const notesAndSummariesConverterMap = {
  [noteTypes.DISCHARGE_SUMMARY]: convertAdmissionAndDischargeDetails,
  [noteTypes.PHYSICIAN_PROCEDURE_NOTE]: convertProgressNote,
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
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
