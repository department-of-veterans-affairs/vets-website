import { parse } from 'date-fns';
import { Actions } from '../util/actionTypes';
import {
  concatCategoryCodeText,
  concatObservationInterpretations,
  dateFormatWithoutTimezone,
  extractContainedResource,
  getObservationValueWithUnits,
  isArrayAndHasItems,
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
   * @type {array}
   */
  labsAndTestsList: undefined,

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
  const results = record.contained.filter(
    recordItem => recordItem.resourceType === 'Observation',
  );
  return results.filter(obs => obs.valueQuantity).map(result => {
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
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport microbiology object
 * @returns the appropriate frontend object for display
 */
const convertMicrobiologyRecord = record => {
  return {
    id: record.id,
    type: labTypes.MICROBIOLOGY,
    name: 'Microbiology',
    category: '',
    orderedBy: 'DOE, JANE A',
    requestedBy: 'John J. Lydon',
    date: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    sampleFrom: record.type?.text || EMPTY_FIELD,
    sampleTested: record.specimen?.text || EMPTY_FIELD,
    orderingLocation:
      '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    collectingLocation: record.performer?.text || EMPTY_FIELD,
    labLocation: '01 DAYTON, OH VAMC 4100 W. THIRD STREET , DAYTON, OH 45428',
    results: record.conclusion || record.result || EMPTY_FIELD,
  };
};

/**
 * @param {Object} record - A FHIR DiagnosticReport pathology object
 * @returns the appropriate frontend object for display
 */
const convertPathologyRecord = record => {
  return {
    id: record.id,
    name: record.code?.text,
    type: labTypes.PATHOLOGY,
    category: concatCategoryCodeText(record) || EMPTY_FIELD,
    orderedBy: record.physician || EMPTY_FIELD,
    requestedBy: record.physician || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? dateFormatWithoutTimezone(record.effectiveDateTime)
      : EMPTY_FIELD,
    sampleTested: record.specimen?.text || EMPTY_FIELD,
    labLocation: record.labLocation || EMPTY_FIELD,
    collectingLocation: record.location || EMPTY_FIELD,
    results: record.conclusion || record.result || EMPTY_FIELD,
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
    clinicalHistory: record.clinicalHistory || EMPTY_FIELD,
    imagingLocation: record.performingLocation,
    date: record.eventDate
      ? dateFormatWithoutTimezone(record.eventDate)
      : EMPTY_FIELD,
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
    if (record.code.text === 'CH') return labTypes.CHEM_HEM;
    if (
      record.code.coding.some(coding => coding.code === loincCodes.MICROBIOLOGY)
    )
      return labTypes.MICROBIOLOGY;
    if (record.code.coding.some(coding => coding.code === loincCodes.PATHOLOGY))
      return labTypes.PATHOLOGY;
  }
  if (record.resourceType === fhirResourceTypes.DOCUMENT_REFERENCE) {
    if (record.type.coding.some(coding => coding.code === loincCodes.EKG))
      return labTypes.EKG;
    if (record.type.coding.some(coding => coding.code === loincCodes.RADIOLOGY))
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
    const dateA = parse(a.date, 'MMMM d, yyyy, h:mm a', new Date());
    const dateB = parse(b.date, 'MMMM d, yyyy, h:mm a', new Date());
    return dateA - dateB;
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
      const labsAndTestsList =
        action.labsAndTestsResponse.entry
          ?.map(record => convertLabsAndTestsRecord(record.resource ?? record))
          .filter(record => record.type !== labTypes.OTHER) || [];
      const radiologyTestsList =
        action.radiologyResponse.map(record =>
          convertLabsAndTestsRecord(record),
        ) || [];
      const allLabsAndTests = sortByDate([
        ...labsAndTestsList,
        ...radiologyTestsList,
      ]);

      return {
        ...state,
        listCurrentAsOf: action.isCurrent ? new Date() : null,
        listState: loadStates.FETCHED,
        labsAndTestsList: allLabsAndTests,
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

/**
 * Clears the lab and test result in the details page
 */
