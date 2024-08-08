import { parseISO } from 'date-fns';
import { Actions } from '../util/actionTypes';
import {
  concatCategoryCodeText,
  concatObservationInterpretations,
  dateFormat,
  dateFormatWithoutTimezone,
  formatDate,
  extractContainedByRecourceType,
  extractContainedResource,
  getObservationValueWithUnits,
  isArrayAndHasItems,
  decodeBase64Report,
} from '../util/helpers';
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

const getLabLocation = (performer, record) => {
  if (isArrayAndHasItems(performer)) {
    const locationRef = performer[0]?.reference;
    const labLocation = extractContainedResource(record, locationRef);
    return labLocation?.name;
  }
  return null;
};

const distillChemHemNotes = (notes, valueProp) => {
  if (isArrayAndHasItems(notes)) {
    return notes.map(note => note[valueProp]);
  }
  return null;
};

/**
 * @param {Object} record - A FHIR chem/hem Observation object
 * @returns the appropriate frontend object for display
 */
const convertChemHemObservation = record => {
  const results = record.contained?.filter(
    recordItem => recordItem.resourceType === 'Observation',
  );
  return results?.filter(obs => obs.valueQuantity).map(result => {
    const { observationValue, observationUnit } = getObservationValueWithUnits(
      result,
    );
    let observationValueWithUnits = `${observationValue} ${observationUnit}`;
    const interpretation = concatObservationInterpretations(result);
    if (observationValueWithUnits && interpretation) {
      observationValueWithUnits += ` (${interpretation})`;
    }
    let standardRange;
    if (observationUnit) {
      standardRange = isArrayAndHasItems(result.referenceRange)
        ? `${result.referenceRange[0].text} ${observationUnit}`
        : null;
    }
    return {
      name: result.code.text,
      result: observationValueWithUnits || EMPTY_FIELD,
      standardRange: standardRange || EMPTY_FIELD,
      status: result.status || EMPTY_FIELD,
      labLocation: getLabLocation(result.performer, record) || EMPTY_FIELD,
      labComments: distillChemHemNotes(result.note, 'text') || EMPTY_FIELD,
    };
  });
};

const getPractitioner = (record, serviceRequest) => {
  const practitionerRef = serviceRequest?.requester?.reference;
  const practitioner = extractContainedResource(record, practitionerRef);
  if (isArrayAndHasItems(practitioner?.name)) {
    const practitionerName = practitioner?.name[0];
    const familyName = practitionerName?.family;
    const givenNames = practitionerName?.given.join(' ');
    return `${familyName ? `${familyName}, ` : ''}${givenNames}`;
  }
  return null;
};

const getSpecimen = record => {
  const specimenRef = isArrayAndHasItems(record.specimen);
  if (specimenRef) {
    const specimen = extractContainedResource(
      record,
      record.specimen[0]?.reference,
    );
    return specimen?.type?.text;
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
const convertChemHemRecord = record => {
  const basedOnRef =
    isArrayAndHasItems(record.basedOn) && record.basedOn[0]?.reference;
  const serviceRequest = extractContainedResource(record, basedOnRef);
  return {
    id: record.id,
    type: labTypes.CHEM_HEM,
    testType: serviceRequest?.code?.text || EMPTY_FIELD,
    name: extractOrderedTests(record) || 'Chemistry/Hematology',
    category: 'Chemistry/Hematology',
    orderedBy: getPractitioner(record, serviceRequest) || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    collectingLocation: getLabLocation(record.performer, record) || EMPTY_FIELD,
    comments: distillChemHemNotes(record.extension, 'valueString'),
    results: convertChemHemObservation(record),
    sampleTested: getSpecimen(record) || EMPTY_FIELD,
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
const convertMicrobiologyRecord = record => {
  const specimen = extractSpecimen(record);
  const labLocation = extractPerformingLabLocation(record) || EMPTY_FIELD;
  return {
    id: record.id,
    type: labTypes.MICROBIOLOGY,
    name: 'Microbiology',
    category: '',
    orderedBy: extractOrderedBy(record) || EMPTY_FIELD,
    dateCompleted: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    date: specimen?.collection?.collectedDateTime
      ? formatDate(specimen.collection.collectedDateTime)
      : EMPTY_FIELD,
    sampleFrom: specimen?.type?.text || EMPTY_FIELD,
    sampleTested: specimen?.collection?.bodySite?.text || EMPTY_FIELD,
    collectingLocation: labLocation,
    labLocation,
    results:
      record.presentedForm?.map(form => decodeBase64Report(form.data)) ||
      EMPTY_FIELD,
    sortDate: record.effectiveDateTime,
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
    category: concatCategoryCodeText(record) || EMPTY_FIELD,
    orderedBy: record.physician || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? formatDate(record.effectiveDateTime)
      : EMPTY_FIELD,
    sampleTested: specimen?.type?.text || EMPTY_FIELD,
    labLocation,
    collectingLocation: labLocation,
    results:
      record.presentedForm?.map(form => decodeBase64Report(form.data)) ||
      EMPTY_FIELD,
    sortDate: record.effectiveDateTime,
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
    date: record.date ? dateFormatWithoutTimezone(record.date) : EMPTY_FIELD,
    facility: 'school parking lot',
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
//     images: [],
//   };
// };

export const convertMhvRadiologyRecord = record => {
  return {
    id: `r${record.id}`,
    name: record.procedureName,
    type: labTypes.RADIOLOGY,
    reason: record.reasonForStudy || EMPTY_FIELD,
    orderedBy: record.requestingProvider || EMPTY_FIELD,
    clinicalHistory: record.clinicalHistory
      ? record.clinicalHistory.trim()
      : EMPTY_FIELD,
    imagingLocation: record.performingLocation,
    date: record.eventDate ? dateFormat(record.eventDate) : EMPTY_FIELD,
    sortDate: record.eventDate,
    imagingProvider: record.radiologist || EMPTY_FIELD,
    results: record.impressionText,
    images: [],
  };
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
    )
      return labTypes.MICROBIOLOGY;
    if (
      record.code?.coding?.some(coding => coding.code === loincCodes.PATHOLOGY)
    )
      return labTypes.PATHOLOGY;
  }
  if (record.resourceType === fhirResourceTypes.DOCUMENT_REFERENCE) {
    if (record.type?.coding.some(coding => coding.code === loincCodes.EKG))
      return labTypes.EKG;
    if (
      record.type?.coding?.some(coding => coding.code === loincCodes.RADIOLOGY)
    )
      return labTypes.OTHER;
  }
  if (Object.prototype.hasOwnProperty.call(record, 'radiologist')) {
    return labTypes.RADIOLOGY;
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
      return {
        ...state,
        labsAndTestsDetails: convertLabsAndTestsRecord(action.response),
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const oldList = state.labsAndTestsList;
      const labsAndTestsList =
        action.labsAndTestsResponse.entry
          ?.map(record => convertLabsAndTestsRecord(record.resource ?? record))
          .filter(record => record.type !== labTypes.OTHER) || [];
      const radiologyTestsList =
        action.radiologyResponse.map(record =>
          convertLabsAndTestsRecord(record),
        ) || [];
      const newList = sortByDate([...labsAndTestsList, ...radiologyTestsList]);

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
