import { parseISO } from 'date-fns';
import { Actions } from '../util/actionTypes';
import {
  formatDateInLocalTimezone,
  formatNameFirstToLast,
  buildInitialDateRange,
} from '../util/helpers';
import {
  areDatesEqualToMinute,
  parseRadiologyReport,
} from '../util/radiologyUtil';
import {
  labTypes,
  EMPTY_FIELD,
  loadStates,
  DEFAULT_DATE_RANGE,
} from '../util/constants';

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
   * The list of radiology records returned from the api
   * @type {Array}
   */
  radiologyList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The radiology record currently being displayed to the user
   */
  radiologyDetails: undefined,
  /**
   * The selected date range for displaying radiology records
   * */
  dateRange: buildInitialDateRange(DEFAULT_DATE_RANGE),
};

export const buildRadiologyResults = record => {
  const reportText = record?.reportText || '\n';
  const impressionText = record?.impressionText || '\n';
  return `Report:\n${reportText
    .replace(/\r\n|\r/g, '\n')
    .replace(/^/gm, '  ')}  
Impression:\n${impressionText.replace(/\r\n|\r/g, '\n').replace(/^/gm, '  ')}`;
};

export const convertMhvRadiologyRecord = record => {
  const orderedBy = formatNameFirstToLast(record.requestingProvider);
  const imagingProvider = formatNameFirstToLast(record.radiologist);
  return {
    id: `r${record.id}-${record.hash}`,
    name: record.procedureName,
    type: labTypes.RADIOLOGY,
    reason: record.reasonForStudy || EMPTY_FIELD,
    orderedBy: orderedBy || EMPTY_FIELD,
    clinicalHistory: record?.clinicalHistory?.trim() || EMPTY_FIELD,
    imagingLocation: record.performingLocation,
    date: record.eventDate
      ? formatDateInLocalTimezone(record.eventDate, true)
      : EMPTY_FIELD,
    sortDate: record.eventDate,
    imagingProvider: imagingProvider || EMPTY_FIELD,
    results: buildRadiologyResults(record),
  };
};

export const convertCvixRadiologyRecord = record => {
  const parsedReport = parseRadiologyReport(record.reportText);
  return {
    id: `r${record.id}-${record.hash}`,
    name: record.procedureName,
    type: labTypes.CVIX_RADIOLOGY,
    reason: parsedReport['Reason for Study'] || EMPTY_FIELD,
    orderedBy: parsedReport['Req Phys'] || EMPTY_FIELD,
    clinicalHistory: parsedReport['Clinical History'] || EMPTY_FIELD,
    imagingLocation: record.facilityInfo?.name || EMPTY_FIELD,
    date: record.performedDatePrecise
      ? formatDateInLocalTimezone(record.performedDatePrecise, true)
      : EMPTY_FIELD,
    sortDate: record.performedDatePrecise
      ? `${new Date(record.performedDatePrecise).toISOString().split('.')[0]}Z`
      : EMPTY_FIELD,
    imagingProvider: EMPTY_FIELD,
    results: buildRadiologyResults({
      reportText: parsedReport.Report,
      impressionText: parsedReport.Impression,
    }),
    studyId: record.studyIdUrn,
    imageCount: record.imageCount,
  };
};

const mergeRadiologyRecords = (phrRecord, cvixRecord) => {
  if (phrRecord && cvixRecord) {
    return {
      ...phrRecord,
      studyId: cvixRecord.studyId,
      imageCount: cvixRecord.imageCount,
    };
  }
  return phrRecord || cvixRecord || null;
};

/**
 * Create a union of the radiology reports from PHR and CVIX. This function will merge
 * duplicates between the two lists.
 *
 * @param {Array} phrRadiologyTestsList - List of PHR radiology records.
 * @param {Array} cvixRadiologyTestsList - List of CVIX radiology records.
 * @returns {Array} - The merged list of radiology records.
 */
export const mergeRadiologyLists = (
  phrRadiologyTestsList,
  cvixRadiologyTestsList,
) => {
  const mergedArray = [];
  const matchedCvixIds = new Set();

  for (const phrRecord of phrRadiologyTestsList) {
    let matchingCvix = null;
    for (const cvixRecord of cvixRadiologyTestsList) {
      if (areDatesEqualToMinute(phrRecord.sortDate, cvixRecord.sortDate)) {
        matchingCvix = cvixRecord;
        matchedCvixIds.add(matchingCvix.id);
        break;
      }
    }
    if (matchingCvix) {
      mergedArray.push(mergeRadiologyRecords(phrRecord, matchingCvix));
    } else {
      mergedArray.push(phrRecord);
    }
  }
  return mergedArray.concat(
    cvixRadiologyTestsList.filter(record => !matchedCvixIds.has(record.id)),
  );
};

function sortByDate(array) {
  return array.sort((a, b) => {
    const dateA = parseISO(a.sortDate);
    const dateB = parseISO(b.sortDate);
    if (!a.sortDate) return 1; // Push nulls to the end
    if (!b.sortDate) return -1; // Keep non-nulls at the front
    return dateB - dateA;
  });
}

export const radiologyReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.Radiology.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    case Actions.Radiology.GET_LIST: {
      const oldList = state.radiologyList;
      const radiologyTestsList = (action.radiologyResponse || [])
        .filter(Boolean)
        .map(convertMhvRadiologyRecord)
        .filter(Boolean);
      const cvixRadiologyTestsList = (action.cvixRadiologyResponse || [])
        .filter(Boolean)
        .map(convertCvixRadiologyRecord)
        .filter(Boolean);
      const mergedList = mergeRadiologyLists(
        radiologyTestsList,
        cvixRadiologyTestsList,
      );
      const newList = sortByDate(mergedList);

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        radiologyList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.Radiology.GET: {
      const { phrDetails, cvixDetails } = action.response;
      const convertedPhr = phrDetails
        ? convertMhvRadiologyRecord(phrDetails)
        : null;
      const convertedCvix = cvixDetails
        ? convertCvixRadiologyRecord(cvixDetails)
        : null;
      return {
        ...state,
        radiologyDetails: mergeRadiologyRecords(convertedPhr, convertedCvix),
      };
    }
    case Actions.Radiology.GET_FROM_LIST: {
      return {
        ...state,
        radiologyDetails: action.response,
      };
    }
    case Actions.Radiology.CLEAR_DETAIL: {
      return {
        ...state,
        radiologyDetails: undefined,
      };
    }
    case Actions.Radiology.COPY_UPDATED_LIST: {
      const originalList = state.radiologyList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          radiologyList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.Radiology.SET_DATE_RANGE: {
      return {
        ...state,
        dateRange: action.payload,
      };
    }
    default:
      return state;
  }
};
