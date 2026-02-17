import { formatDateInLocalTimezone, formatNameFirstToLast } from './helpers';
import {
  areDatesEqualToMinute,
  normalizeProcedureName,
  parseRadiologyReport,
} from './radiologyUtil';
import { labTypes, EMPTY_FIELD } from './constants';

/**
 * Convert an SCDF (v2) imaging study record into the frontend shape used by
 * the labs-and-tests list and the radiology detail views.
 *
 * The SCDF response is JSONAPI-serialized with camelCase attribute keys.
 * Many clinical fields (reason, orderedBy, clinicalHistory, etc.) are not
 * yet available from the SCDF ImagingStudy FHIR resource — those will show
 * EMPTY_FIELD until the backend is enriched.
 *
 * @param {Object} record - A single JSONAPI resource from the imaging studies response
 * @returns {Object} Frontend-shaped imaging study record
 */
export const convertScdfImagingStudy = record => {
  const attrs = record.attributes || record;
  return {
    id: `${record.id}`,
    name: attrs.description || EMPTY_FIELD,
    date: attrs.date
      ? formatDateInLocalTimezone(attrs.date, true)
      : EMPTY_FIELD,
    rawDate: attrs.date || null,
    results: attrs.notes?.length ? attrs.notes.join('\n') : EMPTY_FIELD,
    studyId: attrs.identifier || record.id,
    series: attrs.series || [],
    status: attrs.status || null,
  };
};

/**
 * Maximum allowed difference (in milliseconds) between a lab record's date
 * and an imaging study's date for them to be considered the same study.
 */
const IMAGING_MATCH_TOLERANCE_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Merge SCDF imaging study metadata into a labs-and-tests list by matching
 * records whose dates fall within a tolerance window.
 *
 * For each imaging study, find the first unmatched lab record whose sortDate
 * is within IMAGING_MATCH_TOLERANCE_MS of the imaging study's rawDate.
 * When matched, copy `imagingStudyId` and `imagingStudyStatus` onto the
 * lab record.
 *
 * @param {Array} labsList  - Converted labs-and-tests records (each has `sortDate`)
 * @param {Array} imagingStudies - Converted SCDF imaging studies (each has `rawDate`)
 * @returns {Array} A new array of lab records with imaging fields merged where matched
 */
export const mergeImagingStudiesIntoLabs = (
  labsList = [],
  imagingStudies = [],
) => {
  if (!imagingStudies.length) return labsList;

  // Track which imaging studies have already been matched so each is used at most once
  const matchedImagingIds = new Set();

  return labsList.map(lab => {
    if (!lab.sortDate) return lab;
    const labTime = new Date(lab.sortDate).getTime();
    if (Number.isNaN(labTime)) return lab;

    const match = imagingStudies.find(study => {
      if (matchedImagingIds.has(study.id)) return false;
      if (!study.rawDate) return false;
      const studyTime = new Date(study.rawDate).getTime();
      if (Number.isNaN(studyTime)) return false;
      return Math.abs(labTime - studyTime) <= IMAGING_MATCH_TOLERANCE_MS;
    });

    if (match) {
      matchedImagingIds.add(match.id);
      return {
        ...lab,
        imagingStudyId: match.id,
        imagingStudyStatus: match.status,
      };
    }
    return lab;
  });
};

export const buildRadiologyResults = record => {
  const reportText = record?.reportText || '\n';
  const impressionText = record?.impressionText || '\n';
  return `Report:\n${reportText.replace(/\r\n|\r/g, '\n').replace(/^/gm, '  ')}
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
      : null,
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
 * Extract the hash from a record ID. Record IDs are in the format "r{rawId}-{hash}".
 * @param {string} id - The record ID (e.g., "r12345-abc123ef")
 * @returns {string|null} - The hash portion or null if not found
 */
const extractHashFromId = id => {
  if (!id || typeof id !== 'string') return null;
  const parts = id.split('-');
  return parts.length >= 2 ? parts[parts.length - 1] : null;
};

/**
 * Check if two dates are on the same calendar day.
 * @param {string} date1 - First date string
 * @param {string} date2 - Second date string (can be ISO string or timestamp)
 * @returns {boolean} - True if dates are on the same day
 */
const areDatesOnSameDay = (date1, date2) => {
  const parseDate = input => {
    if (!input) return null;
    if (/^\d+$/.test(input)) {
      return new Date(Number(input));
    }
    return new Date(input);
  };

  const d1 = parseDate(date1);
  const d2 = parseDate(date2);

  if (!d1 || !d2 || Number.isNaN(d1.getTime()) || Number.isNaN(d2.getTime())) {
    return false;
  }

  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

/**
 * Create a union of the radiology reports from PHR and CVIX. This function will merge
 * duplicates between the two lists using any of the following matching strategies
 * (evaluated in parallel - a match on ANY strategy will trigger a merge):
 * 1. Hash matching (computed from procedure name, radiologist, station, and date)
 * 2. Timestamp matching (to the minute)
 * 3. Procedure name + date matching (normalized comparison, same calendar day)
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
    const phrHash = extractHashFromId(phrRecord.id);
    const phrNormalizedName = normalizeProcedureName(phrRecord.name);

    for (const cvixRecord of cvixRadiologyTestsList) {
      // Skip if this CVIX record was already matched to another PHR record
      if (!matchedCvixIds.has(cvixRecord.id)) {
        const cvixHash = extractHashFromId(cvixRecord.id);
        const cvixNormalizedName = normalizeProcedureName(cvixRecord.name);

        // Match by hash (primary) - catches records with same core fields
        const hashesMatch = phrHash && cvixHash && phrHash === cvixHash;

        // Match by timestamp to the minute (legacy behavior)
        const datesMatchToMinute = areDatesEqualToMinute(
          phrRecord.sortDate,
          cvixRecord.sortDate,
        );

        // Match by normalized procedure name + same calendar day (fallback for
        // records where radiologist differs between PHR and CVIX)
        const nameAndDayMatch =
          phrNormalizedName &&
          cvixNormalizedName &&
          phrNormalizedName === cvixNormalizedName &&
          areDatesOnSameDay(phrRecord.sortDate, cvixRecord.sortDate);

        if (hashesMatch || datesMatchToMinute || nameAndDayMatch) {
          matchingCvix = cvixRecord;
          matchedCvixIds.add(matchingCvix.id);
          break;
        }
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

/**
 * Merge PHR and CVIX details for a single radiology record.
 * @param {Object} phrDetails - PHR radiology details (raw from API)
 * @param {Object} cvixDetails - CVIX radiology details (raw from API)
 * @returns {Object} - The merged radiology record
 */
export const mergeRadiologyDetails = (phrDetails, cvixDetails) => {
  const convertedPhr = phrDetails
    ? convertMhvRadiologyRecord(phrDetails)
    : null;
  const convertedCvix = cvixDetails
    ? convertCvixRadiologyRecord(cvixDetails)
    : null;
  return mergeRadiologyRecords(convertedPhr, convertedCvix);
};
