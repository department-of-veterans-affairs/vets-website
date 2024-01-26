import { formatDateLong } from '@department-of-veterans-affairs/platform-utilities/exports';
import { Actions } from '../util/actionTypes';
import {
  concatCategoryCodeText,
  concatObservationInterpretations,
  getObservationValueWithUnits,
  isArrayAndHasItems,
} from '../util/helpers';
import {
  loincCodes,
  fhirResourceTypes,
  labTypes,
  EMPTY_FIELD,
} from '../util/constants';

const initialState = {
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

/**
 * @param {Object} record - A FHIR chem/hem Observation object
 * @returns the appropriate frontend object for display
 */
const convertChemHemObservation = results => {
  return results.filter(obs => obs.valueQuantity).map(result => {
    return {
      name: result.code.text,
      result: getObservationValueWithUnits(result) || EMPTY_FIELD,
      standardRange: result.referenceRange[0].text || EMPTY_FIELD,
      status: result.status || EMPTY_FIELD,
      labLocation: result.labLocation || EMPTY_FIELD,
      interpretation: concatObservationInterpretations(result) || EMPTY_FIELD,
    };
  });
};

/**
 * @param {Object} record - A FHIR DiagnosticReport chem/hem object
 * @returns the appropriate frontend object for display
 */
const convertChemHemRecord = record => {
  const results = record.contained.filter(
    recordItem => recordItem.resourceType === 'Observation',
  );
  return {
    id: record.id,
    type: labTypes.CHEM_HEM,
    name: concatCategoryCodeText(record),
    category: concatCategoryCodeText(record),
    orderedBy: record.physician || EMPTY_FIELD,
    requestedBy: record.physician || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? formatDateLong(record.effectiveDateTime)
      : EMPTY_FIELD,
    orderingLocation: record.location || EMPTY_FIELD,
    collectingLocation: record.location || EMPTY_FIELD,
    comments: [record.conclusion],
    results: convertChemHemObservation(results),
    sampleTested: record.specimen?.text || EMPTY_FIELD,
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
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: record.effectiveDateTime
      ? formatDateLong(record.effectiveDateTime)
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
    category: concatCategoryCodeText(record),
    orderedBy: record.physician || EMPTY_FIELD,
    requestedBy: record.physician || EMPTY_FIELD,
    date: record.effectiveDateTime
      ? formatDateLong(record.effectiveDateTime)
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
    orderedBy: 'Beth M. Smith',
    requestedBy: 'John J. Lydon',
    date: record.date || EMPTY_FIELD,
    facility: 'school parking lot',
  };
};

/**
 * @param {Object} record - A FHIR DocumentReference radiology object
 * @returns the appropriate frontend object for display
 */
const convertRadiologyRecord = record => {
  const typeCodingDisplay = record.type.coding.filter(
    coding => coding.display,
  )[0].display;

  const authorDisplayFields = record.author
    .filter(author => author.display)
    .map(author => author.display);
  const authorDisplay = authorDisplayFields.join(', ');

  return {
    id: record.id,
    name: typeCodingDisplay,
    type: labTypes.RADIOLOGY,
    reason: record.reason || EMPTY_FIELD,
    category: record.category?.text || EMPTY_FIELD,
    orderedBy:
      (isArrayAndHasItems(record.author) && record.author[0].display) ||
      EMPTY_FIELD,
    clinicalHistory: record.clinicalHistory || EMPTY_FIELD,
    imagingLocation: authorDisplay,
    date: record.date ? formatDateLong(record.date) : EMPTY_FIELD,
    imagingProvider: record.physician || EMPTY_FIELD,
    results: Buffer.from(record.content[0].attachment.data, 'base64').toString(
      'utf-8',
    ),
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
  [labTypes.RADIOLOGY]: convertRadiologyRecord,
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

export const labsAndTestsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.LabsAndTests.GET: {
      return {
        ...state,
        labsAndTestsDetails: convertLabsAndTestsRecord(action.response),
      };
    }
    case Actions.LabsAndTests.GET_LIST: {
      const recordList = action.response;
      return {
        ...state,
        labsAndTestsList:
          recordList.entry
            ?.map(record => convertLabsAndTestsRecord(record))
            .filter(record => record.type !== labTypes.OTHER) || [],
      };
    }
    case Actions.LabsAndTests.CLEAR_DETAIL: {
      return {
        ...state,
        labsAndTestsDetails: undefined,
      };
    }
    default:
      return state;
  }
};

/**
 * Clears the lab and test result in the details page
 */
