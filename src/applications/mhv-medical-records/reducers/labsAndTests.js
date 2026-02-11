import { Actions } from '../util/actionTypes';
import {
  concatObservationInterpretations,
  formatDate,
  dateFormatWithoutTimezone,
  formatDateTimeInUserTimezone,
  extractContainedByRecourceType,
  extractContainedResource,
  getObservationValueWithUnits,
  isArrayAndHasItems,
  decodeBase64Report,
  formatNameFirstToLast,
  buildInitialDateRange,
  sortByDate,
} from '../util/helpers';
import {
  loincCodes,
  fhirResourceTypes,
  labTypes,
  EMPTY_FIELD,
  loadStates,
  DEFAULT_DATE_RANGE,
} from '../util/constants';
import {
  convertMhvRadiologyRecord,
  convertCvixRadiologyRecord,
  mergeRadiologyLists,
  mergeRadiologyDetails,
} from '../util/imagesUtil';

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
  /**
   * The selected date range for displaying labs and tests
   * */
  dateRange: buildInitialDateRange(DEFAULT_DATE_RANGE),
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
        ? `${result.referenceRange[0]?.text} ${observationUnit}`.trim()
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

  // First try to find a display value in the coding array
  if (isArrayAndHasItems(serviceReq?.code?.coding)) {
    const codingWithDisplay = serviceReq.code.coding.find(
      item => item.display && item.display.trim() !== '',
    );
    if (codingWithDisplay?.display) {
      return codingWithDisplay.display;
    }
  }

  // Fall back to code.text if no display found
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
    return performingLab.name[0]?.text || null;
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
export const convertPathologyRecord = record => {
  // Guard against null/undefined records to prevent TypeErrors
  if (!record) return null;

  // Safely access the first coding entry's code value
  const codeValue = record?.code?.coding?.[0]?.code;

  // Define mapping for new LOINC codes to names
  const loincCodeMapping = {
    [loincCodes.PATHOLOGY]: 'Pathology',
    [loincCodes.SURGICAL_PATHOLOGY]: 'Surgical Pathology',
    [loincCodes.ELECTRON_MICROSCOPY]: 'Electron Microscopy',
    [loincCodes.CYTOPATHOLOGY]: 'Cytology',
  };

  // Determine pathology type based on LOINC code (fallback to generic Pathology)
  let pathologyType;
  if (codeValue === loincCodes.PATHOLOGY) {
    // Prefer record.code.text when available; fallback to mapping value
    pathologyType =
      record?.code?.text || loincCodeMapping[loincCodes.PATHOLOGY];
  } else if (
    codeValue === loincCodes.SURGICAL_PATHOLOGY ||
    codeValue === loincCodes.ELECTRON_MICROSCOPY ||
    codeValue === loincCodes.CYTOPATHOLOGY
  ) {
    pathologyType = loincCodeMapping[codeValue];
  } else {
    pathologyType = 'Pathology'; // fallback
  }

  const specimen = extractSpecimen(record);
  const labLocation = extractPerformingLabLocation(record) || EMPTY_FIELD;

  return {
    id: record.id,
    name: pathologyType,
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
    results: Array.isArray(record.presentedForm)
      ? record.presentedForm.map(form => decodeBase64Report(form.data))
      : EMPTY_FIELD,
    sortDate: record.effectiveDateTime,
    labComments: record.labComments || EMPTY_FIELD,
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

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the type of lab/test that was passed
 */
const getRecordType = record => {
  if (record.resourceType === fhirResourceTypes.DIAGNOSTIC_REPORT) {
    const coding = record.code?.coding;
    const loincMap = {
      [loincCodes.MICROBIOLOGY]: labTypes.MICROBIOLOGY,
      [loincCodes.PATHOLOGY]: labTypes.PATHOLOGY,
      [loincCodes.SURGICAL_PATHOLOGY]: labTypes.PATHOLOGY,
      [loincCodes.ELECTRON_MICROSCOPY]: labTypes.PATHOLOGY,
      [loincCodes.CYTOPATHOLOGY]: labTypes.PATHOLOGY,
    };

    // Check if the code text is 'CH'
    if (record.code?.text === 'CH') return labTypes.CHEM_HEM;

    // Check if coding matches any LOINC code using Object.entries()
    for (const [code, type] of Object.entries(loincMap)) {
      if (coding?.some(c => c.code === code)) {
        return type;
      }
    }
  }
  if (record.resourceType === fhirResourceTypes.DOCUMENT_REFERENCE) {
    return labTypes.OTHER;
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
  [labTypes.RADIOLOGY]: convertMhvRadiologyRecord,
  [labTypes.CVIX_RADIOLOGY]: convertCvixRadiologyRecord,
};

/**
 * @param {Object} record - A FHIR DiagnosticReport or DocumentReference object
 * @returns the appropriate frontend object for display
 */
export const convertLabsAndTestsRecord = record => {
  // Null/undefined guard to prevent TypeErrors when upstream arrays contain nulls
  if (!record) return null;
  const type = getRecordType(record);
  const convertRecord = labsAndTestsConverterMap[type];
  return convertRecord
    ? convertRecord(record)
    : { ...record, type: labTypes.OTHER };
};

export const convertUnifiedLabsAndTestRecord = record => {
  // If facilityTimezone is truthy, the backend has already converted dateCompleted
  // to facility local time - display it as-is (wall clock time).
  // If facilityTimezone is null or undefined (falsy), dateCompleted is still UTC - convert to the user's browser timezone.
  const { facilityTimezone, dateCompleted } = record.attributes;
  const date = facilityTimezone
    ? dateFormatWithoutTimezone(dateCompleted) || EMPTY_FIELD
    : formatDateTimeInUserTimezone(dateCompleted) || EMPTY_FIELD;

  return {
    id: record.id,
    date,
    name: record.attributes.display,
    location: record.attributes.location,
    observations: record.attributes.observations,
    orderedBy: record.attributes.orderedBy,
    sampleTested: record.attributes.sampleTested,
    bodySite: record.attributes.bodySite,
    testCode: record.attributes.testCode,
    testCodeDisplay:
      record.attributes.testCodeDisplay || record.attributes.testCode,
    type: record.attributes.testCode,
    comments: record.attributes.comments,
    source: record.attributes.source,
    facilityTimezone,
    result: record.attributes.encodedData
      ? decodeBase64Report(record.attributes.encodedData)
      : null,
    sortDate: dateCompleted,
    base: {
      ...record,
    },
  };
};

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      if ('phrDetails' in action.response) {
        // Special case to handle radiology.
        return {
          ...state,
          labsAndTestsDetails: mergeRadiologyDetails(
            action.response.phrDetails,
            action.response.cvixDetails,
          ),
        };
      }
      return {
        ...state,
        labsAndTestsDetails: convertLabsAndTestsRecord(action.response),
      };
    }
    case Actions.LabsAndTests.GET_UNIFIED_ITEM_FROM_LIST: {
      return {
        ...state,
        labsAndTestsDetails: action.response.data.id
          ? convertUnifiedLabsAndTestRecord(action.response.data)
          : { ...action.response.data },
      };
    }
    case Actions.LabsAndTests.GET_FROM_LIST: {
      return {
        ...state,
        labsAndTestsDetails: action.response,
      };
    }
    case Actions.LabsAndTests.GET_UNIFIED_LIST: {
      // Coerce unified response to array before map/sort to avoid TypeErrors
      const data = Array.isArray(action.labsAndTestsResponse)
        ? action.labsAndTestsResponse
        : [];
      const labsAndTestsList = data.map(record =>
        convertUnifiedLabsAndTestRecord(record),
      );

      // We will temporarily merge CVIX records w/ SCDF records while we wait for images to
      // be available in SCDF radiology records.
      const cvixData = Array.isArray(action.cvixRadiologyResponse)
        ? action.cvixRadiologyResponse
        : [];
      const cvixList =
        cvixData?.map(cvixRecord => {
          const record = convertCvixRadiologyRecord(cvixRecord);
          return {
            ...record,
            // For unified data, we are currently NOT hashing the CVIX radiology records, so
            // remove 'undefined' hash from CVIX records
            id: record.id.replace(/-undefined$/, ''),
          };
        }) || [];
      const mergedList = [...labsAndTestsList, ...cvixList];

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        labsAndTestsList: sortByDate(mergedList),
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const oldList = state.labsAndTestsList;
      const toArray = v => (Array.isArray(v) ? v : []);
      // Coerce all sources to arrays before processing
      const entry = toArray(action.labsAndTestsResponse?.entry);
      const labsAndTestsList = entry
        .map(record => convertLabsAndTestsRecord(record.resource))
        .filter(record => record && record.type !== labTypes.OTHER);
      // Filter out nulls BEFORE mapping to avoid calling converter with null
      const radiologyTestsList = toArray(action.radiologyResponse)
        .filter(Boolean)
        .map(convertLabsAndTestsRecord)
        .filter(Boolean);
      const cvixRadiologyTestsList = toArray(action.cvixRadiologyResponse)
        .filter(Boolean)
        .map(convertLabsAndTestsRecord)
        .filter(Boolean);
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
    case Actions.LabsAndTests.SET_DATE_RANGE: {
      return {
        ...state,
        dateRange: action.payload,
      };
    }
    default:
      return state;
  }
};
