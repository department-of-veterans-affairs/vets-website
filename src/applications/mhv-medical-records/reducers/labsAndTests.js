import { parseISO } from 'date-fns';
import { Actions } from '../util/actionTypes';
import {
  concatObservationInterpretations,
  dateFormatWithoutTimezone,
  formatDate,
  extractContainedByRecourceType,
  extractContainedResource,
  getObservationValueWithUnits,
  isArrayAndHasItems,
  decodeBase64Report,
  formatNameFirstToLast,
} from '../util/helpers';
import {
  areDatesEqualToMinute,
  parseRadiologyReport,
} from '../util/radiologyUtil';
import {
  loincCodes,
  fhirResourceTypes,
  labTypes,
  EMPTY_FIELD,
  loadStates,
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
   * The list of lab and test results returned from the api
   * @type {Array}
   */
  labsAndTestsList: undefined,
  /**
   * New list of records retrieved. This list is NOT displayed. It must manually be copied into the display list.
   * @type {Array}
   */
  updatedList: undefined,
  /**
   * The lab or test result currently being displayed to the user
   */
  labsAndTestsDetails: undefined,
};

export const extractLabLocation = (performer, record) => {
  if (!isArrayAndHasItems(performer)) return null;
  const locationRef = performer.find(item => item.reference);
  const labLocation = extractContainedResource(record, locationRef?.reference);
  return labLocation?.name || null;
};

export const distillChemHemNotes = (notes, valueProp) => {
  let noteString;
  if (isArrayAndHasItems(notes)) {
    noteString = notes.map(note => note[valueProp]);
    if (noteString.toString()) return noteString;
  }
  return null;
};

/**
 * @param {Object} record - A FHIR chem/hem Observation object
 * @returns the appropriate frontend object for display
 */
export const convertChemHemObservation = record => {
  const results = isArrayAndHasItems(record.result)
    ? record.result.map(item =>
        extractContainedResource(record, item.reference),
      )
    : [];

  return results?.map(result => {
    let finalObservationValue = '';
    let standardRange = null;
    if (result.valueQuantity) {
      const {
        observationValue,
        observationUnit,
      } = getObservationValueWithUnits(result);
      finalObservationValue = `${observationValue} ${observationUnit}`;
      standardRange = isArrayAndHasItems(result.referenceRange)
        ? `${result.referenceRange[0].text} ${observationUnit}`.trim()
        : null;
    }
    if (result.valueString) {
      finalObservationValue = result.valueString;
    }
    const interpretation = concatObservationInterpretations(result);
    if (finalObservationValue && interpretation) {
      finalObservationValue += ` (${interpretation})`;
    }

    return {
      name: result?.code?.text || EMPTY_FIELD,
      result: finalObservationValue || EMPTY_FIELD,
      standardRange: standardRange || EMPTY_FIELD,
      status: result.status || EMPTY_FIELD,
      labLocation: extractLabLocation(result.performer, record) || EMPTY_FIELD,
      labComments: distillChemHemNotes(result.note, 'text') || EMPTY_FIELD,
    };
  });
};

export const extractPractitioner = (record, serviceRequest) => {
  const practitionerRef = serviceRequest?.requester?.reference;
  const practitioner = extractContainedResource(record, practitionerRef);
  if (isArrayAndHasItems(practitioner?.name)) {
    const practitionerName = practitioner?.name[0];
    return formatNameFirstToLast(practitionerName);
  }
  return null;
};

/**
 * Extract a specimen resource from a FHIR resource's "contained" array.
 * @param {Object} record a FHIR resource (e.g. AllergyIntolerance)
 * @returns the specified contained FHIR resource, or null if not found
 */
export const extractSpecimen = record => {
  if (isArrayAndHasItems(record.specimen)) {
    const specimenRef = record.specimen.find(item => item.reference);
    const specimen = extractContainedResource(record, specimenRef?.reference);
    return specimen || null;
  }
  return null;
};

export const extractOrderedTest = (record, id) => {
  const serviceReq = extractContainedResource(record, id);
  return serviceReq?.code?.text || null;
};

export const extractOrderedTests = record => {
  if (isArrayAndHasItems(record.basedOn)) {
    const orderedTests = record.basedOn
      .map(item => {
        return extractOrderedTest(record, item?.reference) || null;
      })
      .filter(item => item !== null)
      .join(', ');
    return orderedTests === '' ? null : orderedTests;
  }
  return null;
};

/**
 * @param {Object} record - A FHIR DiagnosticReport chem/hem object
 * @returns the appropriate frontend object for display
 */
export const convertChemHemRecord = record => {
  const basedOnRef =
    isArrayAndHasItems(record.basedOn) && record.basedOn[0]?.reference;
  const serviceRequest = extractContainedResource(record, basedOnRef);
  const specimen = extractSpecimen(record);
  return {
    id: record.id,
    type: labTypes.CHEM_HEM,
    testType: serviceRequest?.code?.text || EMPTY_FIELD,
    name: extractOrderedTests(record) || 'Chemistry/Hematology',
    category: 'Chemistry and hematology',
    orderedBy: extractPractitioner(record, serviceRequest) || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    collectingLocation:
      extractLabLocation(record.performer, record) || EMPTY_FIELD,
    comments:
      distillChemHemNotes(record.extension, 'valueString') || EMPTY_FIELD,
    results: convertChemHemObservation(record),
    sampleTested: specimen?.type?.text || EMPTY_FIELD,
    sortDate: record.effectiveDateTime,
  };
};

export const extractPerformingLabLocation = record => {
  const performingLab = extractContainedByRecourceType(
    record,
    fhirResourceTypes.ORGANIZATION,
    record.performer,
  );
  return performingLab?.name || null;
};

export const extractOrderedBy = record => {
  const performingLab = extractContainedByRecourceType(
    record,
    fhirResourceTypes.PRACTITIONER,
    record.performer,
  );
  if (isArrayAndHasItems(performingLab?.name)) {
    return performingLab.name[0].text || null;
  }
  return null;
};

/**
 * @param {Object} record - A FHIR DiagnosticReport microbiology object
 * @returns the appropriate frontend object for display
 */
export const convertMicrobiologyRecord = record => {
  const specimen = extractSpecimen(record);
  const labLocation = extractPerformingLabLocation(record) || EMPTY_FIELD;
  const title = record?.code?.text;
  return {
    id: record.id,
    type: labTypes.MICROBIOLOGY,
    name: title || 'Microbiology',
    labType: title ? 'Microbiology' : null,
    orderedBy: extractOrderedBy(record) || EMPTY_FIELD,
    dateCompleted: record.effectiveDateTime
      ? formatDate(record.effectiveDateTime)
      : EMPTY_FIELD,
    date: specimen?.collection?.collectedDateTime
      ? dateFormatWithoutTimezone(specimen.collection.collectedDateTime)
      : EMPTY_FIELD,
    sampleFrom: specimen?.type?.text || EMPTY_FIELD,
    sampleTested: specimen?.collection?.bodySite?.text || EMPTY_FIELD,
    collectingLocation: labLocation,
    labLocation,
    results:
      record.presentedForm?.map(form => decodeBase64Report(form.data)) ||
      EMPTY_FIELD,
    sortDate: specimen?.collection?.collectedDateTime,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport pathology object
 * @returns the appropriate frontend object for display
 */
const convertPathologyRecord = record => {
  const specimen = extractSpecimen(record);
  const labLocation = extractPerformingLabLocation(record) || EMPTY_FIELD;
  return {
    id: record.id,
    name: record.code?.text,
    type: labTypes.PATHOLOGY,
    orderedBy: record.physician || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime, 'MMMM d, yyyy')
      : EMPTY_FIELD,
    dateCollected: specimen?.collection?.collectedDateTime
      ? dateFormatWithoutTimezone(specimen.collection.collectedDateTime)
      : EMPTY_FIELD,
    sampleFrom: specimen?.type?.text || EMPTY_FIELD,
    sampleTested: specimen?.collection?.bodySite?.text || EMPTY_FIELD,
    labLocation,
    collectingLocation: labLocation,
    results:
      record.presentedForm?.map(form => decodeBase64Report(form.data)) ||
      EMPTY_FIELD,
    sortDate: record.effectiveDateTime,
    labComments: record.labComments || EMPTY_FIELD,
  };
};

/**
 * @param {Object} record - A FHIR DocumentReference EKG object
 * @returns the appropriate frontend object for display
 */
const convertEkgRecord = record => {
  return {
    id: record.id,
    name: 'Electrocardiogram (EKG)',
    type: labTypes.EKG,
    category: '',
    orderedBy: 'DOE, JANE A',
    requestedBy: 'John J. Lydon',
    signedBy: 'Beth M. Smith',
    date: record.date ? dateFormatWithoutTimezone(record.date) : EMPTY_FIELD,
    facility: 'Washington DC VAMC',
    sortDate: record.date,
  };
};

/**
 * @param {Object} record - A FHIR DocumentReference radiology object
 * @returns the appropriate frontend object for display
 */
// const convertRadiologyRecord = record => {
//   const typeCodingDisplay = record.type.coding.filter(
//     coding => coding.display,
//   )[0].display;

//   const authorDisplayFields = record.author
//     .filter(author => author.display)
//     .map(author => author.display);
//   const authorDisplay = authorDisplayFields.join(', ');

//   return {
//     id: record.id,
//     name: typeCodingDisplay,
//     type: labTypes.RADIOLOGY,
//     reason: record.reason || EMPTY_FIELD,
//     category: record.category?.text || EMPTY_FIELD,
//     orderedBy:
//       (isArrayAndHasItems(record.author) && record.author[0].display) ||
//       EMPTY_FIELD,
//     clinicalHistory: record.clinicalHistory || EMPTY_FIELD,
//     imagingLocation: authorDisplay,
//     date: record.date ? dateFormatWithoutTimezone(record.date) : EMPTY_FIELD,
//     imagingProvider: record.physician || EMPTY_FIELD,
//     results: Buffer.from(record.content[0].attachment.data, 'base64').toString(
//       'utf-8',
//     ),
//   };
// };

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
      ? dateFormatWithoutTimezone(record.eventDate)
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
      ? dateFormatWithoutTimezone(record.performedDatePrecise)
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

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the type of lab/test that was passed
 */
const getRecordType = record => {
  if (record.resourceType === fhirResourceTypes.DIAGNOSTIC_REPORT) {
    if (record.code?.text === 'CH') return labTypes.CHEM_HEM;
    if (
      record.code?.coding?.some(
        coding => coding.code === loincCodes.MICROBIOLOGY,
      )
    ) {
      return labTypes.MICROBIOLOGY;
    }
    if (
      record.code?.coding?.some(coding => coding.code === loincCodes.PATHOLOGY)
    ) {
      return labTypes.PATHOLOGY;
    }
  }
  if (record.resourceType === fhirResourceTypes.DOCUMENT_REFERENCE) {
    if (record.type?.coding?.some(coding => coding.code === loincCodes.EKG)) {
      return labTypes.EKG;
    }
    if (
      record.type?.coding?.some(coding => coding.code === loincCodes.RADIOLOGY)
    ) {
      return labTypes.OTHER;
    }
  }
  if (Object.prototype.hasOwnProperty.call(record, 'radiologist')) {
    return labTypes.RADIOLOGY;
  }
  if (Object.prototype.hasOwnProperty.call(record, 'studyJob')) {
    return labTypes.CVIX_RADIOLOGY;
  }

  return labTypes.OTHER;
};

/**
 * Maps each record type to a converter function
 */
const labsAndTestsConverterMap = {
  [labTypes.CHEM_HEM]: convertChemHemRecord,
  [labTypes.MICROBIOLOGY]: convertMicrobiologyRecord,
  [labTypes.PATHOLOGY]: convertPathologyRecord,
  [labTypes.EKG]: convertEkgRecord,
  [labTypes.RADIOLOGY]: convertMhvRadiologyRecord,
  [labTypes.CVIX_RADIOLOGY]: convertCvixRadiologyRecord,
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the appropriate frontend object for display
 */
export const convertLabsAndTestsRecord = record => {
  const type = getRecordType(record);
  const convertRecord = labsAndTestsConverterMap[type];
  return convertRecord
    ? convertRecord(record)
    : { ...record, type: labTypes.OTHER };
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

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      if ('phrDetails' in action.response) {
        // Special case to handle radiology.
        const { phrDetails, cvixDetails } = action.response;
        const convertedPhr = phrDetails
          ? convertMhvRadiologyRecord(phrDetails)
          : null;
        const convertedCvix = cvixDetails
          ? convertCvixRadiologyRecord(cvixDetails)
          : null;
        return {
          ...state,
          labsAndTestsDetails: mergeRadiologyRecords(
            convertedPhr,
            convertedCvix,
          ),
        };
      }
      return {
        ...state,
        labsAndTestsDetails: convertLabsAndTestsRecord(action.response),
      };
    }
    case Actions.LabsAndTests.GET_FROM_LIST: {
      return {
        ...state,
        labsAndTestsDetails: action.response,
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const oldList = state.labsAndTestsList;
      const labsAndTestsList =
        action.labsAndTestsResponse.entry
          ?.map(record => convertLabsAndTestsRecord(record.resource))
          .filter(record => record.type !== labTypes.OTHER) || [];
      const radiologyTestsList = (action.radiologyResponse || []).map(
        convertLabsAndTestsRecord,
      );
      const cvixRadiologyTestsList = (action.cvixRadiologyResponse || []).map(
        convertLabsAndTestsRecord,
      );
      const mergedRadiologyList = mergeRadiologyLists(
        radiologyTestsList,
        cvixRadiologyTestsList,
      );
      const newList = sortByDate([...labsAndTestsList, ...mergedRadiologyList]);

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        labsAndTestsList: typeof oldList === 'undefined' ? newList : oldList,
        updatedList: typeof oldList !== 'undefined' ? newList : undefined,
      };
    }
    case Actions.LabsAndTests.COPY_UPDATED_LIST: {
      const originalList = state.labsAndTestsList;
      const { updatedList } = state;
      if (
        Array.isArray(originalList) &&
        Array.isArray(updatedList) &&
        originalList.length !== updatedList.length
      ) {
        return {
          ...state,
          labsAndTestsList: state.updatedList,
          updatedList: undefined,
        };
      }
      return {
        ...state,
      };
    }
    case Actions.LabsAndTests.CLEAR_DETAIL: {
      return {
        ...state,
        labsAndTestsDetails: undefined,
      };
    }
    case Actions.LabsAndTests.UPDATE_LIST_STATE: {
      return {
        ...state,
        listState: action.payload,
      };
    }
    default:
      return state;
  }
};
