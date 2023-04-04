import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import { isValidUSZipCode } from 'platform/forms/address';

import { errorMessages, MAX_LENGTH } from '../constants';
import { validateDate } from './date';

const REGEX_EMPTY_DATE = /--/;

/* *** VA *** */
export const validateVaLocation = (errors, data) => {
  const { locationAndName } = data || {};
  if (!locationAndName) {
    errors.addError(errorMessages.evidence.locationMissing);
  } else if (locationAndName.length > MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME) {
    errors.addError(errorMessages.evidence.locationMaxLength);
  }
};

export const validateVaIssues = (errors, data) => {
  if (!data.issues?.length) {
    errors.addError(errorMessages.evidence.issuesMissing);
  }
};

// Overloading fullDate parameter with evidence date type to control error
// messaging
export const validateVaFromDate = (errors, data) =>
  validateDate(errors, data.evidenceDates?.from, { dateType: 'evidence' });

export const validateVaToDate = (errors, data) => {
  const dates = data.evidenceDates || {};
  validateDate(errors, dates?.to, { dateType: 'evidence' });

  // modified from validateDateRange
  const fromDate = convertToDateField(dates?.from);
  const toDate = convertToDateField(dates?.to);

  if (!isValidDateRange(fromDate, toDate, true)) {
    errors.addError(errorMessages.endDateBeforeStart);
  }
};

// Check if VA evidence object is empty
// an empty va-memorable-date value may equal '--'
export const isEmptyVaEntry = (checkData = {}) =>
  [
    checkData.locationAndName || '',
    ...(checkData.issues || []),
    (checkData.evidenceDates?.from || '').replace(REGEX_EMPTY_DATE, ''),
    (checkData.evidenceDates?.to || '').replace(REGEX_EMPTY_DATE, ''),
  ].join('') === '';

export const validateVaUnique = (errors, _data, fullData) => {
  const locations = (fullData?.locations || [])
    .filter(location => !isEmptyVaEntry(location))
    .map(({ locationAndName, issues = [], evidenceDates = {} } = {}) =>
      [
        locationAndName || '',
        ...issues,
        evidenceDates?.from || '',
        evidenceDates?.to || '',
      ]
        .join(',')
        .toLowerCase(),
    );
  const uniqueLocations = new Set(locations);
  if (locations.length > 1 && locations.length !== uniqueLocations.size) {
    errors.addError(errorMessages.evidence.unique);
  }
};

/* *** Private *** */
export const validatePrivateName = (errors, data) => {
  const { providerFacilityName } = data || {};
  if (!providerFacilityName) {
    errors.addError(errorMessages.evidence.facilityMissing);
  }
};

export const validateCountry = (errors, data) => {
  const { country } = data?.providerFacilityAddress || {};
  if (!country) {
    errors.addError(errorMessages.evidence.country);
  }
};
export const validateStreet = (errors, data) => {
  const { street } = data?.providerFacilityAddress || {};
  if (!street) {
    errors.addError(errorMessages.evidence.street);
  }
};
export const validateCity = (errors, data) => {
  const { city } = data?.providerFacilityAddress || {};
  if (!city) {
    errors.addError(errorMessages.evidence.city);
  }
};
export const validateState = (errors, data) => {
  const { state } = data?.providerFacilityAddress || {};
  if (!state) {
    errors.addError(errorMessages.evidence.state);
  }
};
export const validatePostal = (errors, data) => {
  const { postalCode } = data?.providerFacilityAddress || {};
  if (!postalCode) {
    errors.addError(errorMessages.evidence.postal);
  } else if (!isValidUSZipCode(postalCode)) {
    errors.addError(errorMessages.invalidZip);
  }
};

export const validatePrivateIssues = (errors, data) => {
  if (!data.issues?.length) {
    errors.addError(errorMessages.evidence.issuesMissing);
  }
};

// Overloading fullDate parameter with evidence date type to control error
// messaging
export const validatePrivateFromDate = (errors, data) =>
  validateDate(errors, data.treatmentDateRange?.from, { dateType: 'evidence' });

export const validatePrivateToDate = (errors, data) => {
  const dates = data.treatmentDateRange || {};
  validateDate(errors, dates?.to, { dateType: 'evidence' });

  // modified from validateDateRange
  const fromDate = convertToDateField(dates?.from);
  const toDate = convertToDateField(dates?.to);

  if (!isValidDateRange(fromDate, toDate, true)) {
    errors.addError(errorMessages.endDateBeforeStart);
  }
};

// Check if private evidence object is empty
// an empty va-memorable-date value may equal '--'
export const isEmptyPrivateEntry = (checkData = {}) => {
  const result = [
    checkData.providerFacilityName || '',
    ...Object.values(checkData.providerFacilityAddress || {}),
    ...(checkData.issues || []),
    (checkData.treatmentDateRange?.from || '').replace(REGEX_EMPTY_DATE, ''),
    (checkData.treatmentDateRange?.to || '').replace(REGEX_EMPTY_DATE, ''),
  ].join('');
  // country defaults to 'USA' when adding a new entry
  return result === '' || result === 'USA';
};

export const validatePrivateUnique = (
  errors,
  _fieldData,
  fullData = {},
  _schema,
  _uiSchema,
  index,
) => {
  // combine all data into a comma-separated string value for easy comparison
  const facilities = (fullData?.providerFacility || []).map(
    ({
      providerFacilityName,
      providerFacilityAddress = {},
      issues = [],
      treatmentDateRange = {},
    } = {}) =>
      [
        providerFacilityName || '',
        ...issues,
        Object.values(providerFacilityAddress || {}).join(','),
        treatmentDateRange?.from || '',
        treatmentDateRange?.to || '',
      ]
        .join(',')
        .toLowerCase(),
  );
  const uniqueFacilities = new Set(facilities);
  const len = facilities.length;
  if (len > 1 && len !== uniqueFacilities.size) {
    // only show error for last duplicate item; findLastIndex doesn't work with
    // node v14 unit tests, so re-writting this :(
    // const lastIndex = facilities.findLastIndex(
    //   (item, indx) =>
    //     item === facilities[index] && facilities.indexOf(item) !== indx,
    // );
    let lastIndex = -1;
    let indx = len;
    while (indx > 0) {
      const item = facilities[indx];
      if (item === facilities[index] && facilities.indexOf(item) !== indx) {
        lastIndex = indx;
        indx = 0;
      }
      indx -= 1;
    }
    if (lastIndex === index) {
      errors.addError(errorMessages.evidence.unique);
    }
  }
};
