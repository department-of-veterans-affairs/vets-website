import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';
import { isValidUSZipCode } from 'platform/forms/address';

import { errorMessages, REGEX_COMMA, REGEX_EMPTY_DATE } from '../constants';
import { getSelected, getIssueName } from '../utils/helpers';
import { validateDate } from './date';

import { MAX_LENGTH } from '../../shared/constants';
import { fixDateFormat } from '../../shared/utils/replace';

// Needed for uniqueness string comparison
const sortIssues = issues =>
  issues.map(issue => (issue || '').toLowerCase()).sort();

/* *** VA *** */
export const validateVaLocation = (errors, data) => {
  const { locationAndName } = data || {};
  if (!locationAndName) {
    errors.addError(errorMessages.evidence.locationMissing);
  } else if (
    locationAndName.length > MAX_LENGTH.SC_EVIDENCE_LOCATION_AND_NAME
  ) {
    errors.addError(errorMessages.evidence.locationMaxLength);
  }
};

export const validateVaIssues = (
  errors,
  _data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  const issues = fullData?.locations?.[currentIndex]?.issues || [];
  const selectedIssues = getSelected(fullData).map(getIssueName);
  const allSelectedIssues = issues.every(issue =>
    selectedIssues.includes(issue),
  );
  if (!issues?.length || !allSelectedIssues) {
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
    errors.addError('other'); // invalid inputs
  }
};

export const buildVaLocationString = (
  data,
  joiner = '',
  { includeIssues = true } = {},
) =>
  [
    data.locationAndName || '',
    ...sortIssues(includeIssues ? data.issues || [] : []),
    fixDateFormat(data.evidenceDates?.from || '').replace(REGEX_EMPTY_DATE, ''),
    fixDateFormat(data.evidenceDates?.to || '').replace(REGEX_EMPTY_DATE, ''),
  ].join(joiner);

// Check if VA evidence object is empty
// an empty va-memorable-date value may equal '--'
export const isEmptyVaEntry = (checkData = {}) =>
  buildVaLocationString(checkData) === '';

export const validateVaUnique = (
  errors,
  _data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  const locations = (fullData?.locations || []).map(data =>
    buildVaLocationString(data, ',').toLowerCase(),
  );
  const uniqueLocations = new Set(locations);
  if (locations.length > 1 && locations.length !== uniqueLocations.size) {
    const hasDuplicate = locations.find(location => {
      if (location.replace(REGEX_COMMA, '') === '') {
        return false;
      }
      const firstIndex = locations.indexOf(location);
      const lastIndex = locations.lastIndexOf(location);
      // only
      return firstIndex !== lastIndex && lastIndex === currentIndex;
    });
    if (hasDuplicate) {
      errors.addError(errorMessages.evidence.uniqueVA);
    }
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

export const validatePrivateIssues = (
  errors,
  data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  const issues = fullData?.providerFacility?.[currentIndex]?.issues || [];
  const selectedIssues = getSelected(fullData).map(getIssueName);
  const allSelectedIssues = issues.every(issue =>
    selectedIssues.includes(issue),
  );
  if (!issues?.length || !allSelectedIssues) {
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
    errors.addError('other'); // invalid inputs
  }
};

export const buildPrivateString = (
  data,
  joiner = '',
  { includeIssues = true } = {},
) =>
  [
    data.providerFacilityName || '',
    ...Object.values(data.providerFacilityAddress || {}),
    ...sortIssues(includeIssues ? data.issues || [] : []),
    fixDateFormat(data.treatmentDateRange?.from || '').replace(
      REGEX_EMPTY_DATE,
      '',
    ),
    fixDateFormat(data.treatmentDateRange?.to || '').replace(
      REGEX_EMPTY_DATE,
      '',
    ),
  ].join(joiner);

export const isEmptyPrivateEntry = (checkData = {}) => {
  const result = buildPrivateString(checkData);
  // country defaults to 'USA' when adding a new entry
  return result === '' || result === 'USA';
};

export const validatePrivateUnique = (
  errors,
  _fieldData,
  fullData = {},
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  // combine all data into a comma-separated string value for easy comparison
  const facilities = (fullData?.providerFacility || []).map(facility =>
    buildPrivateString(facility, ',').toLowerCase(),
  );
  const uniqueFacilities = new Set(facilities);
  const len = facilities.length;
  if (len > 1 && len !== uniqueFacilities.size) {
    const hasDuplicate = facilities.find(facility => {
      if (facility.replace(REGEX_COMMA, '') === '') {
        return false;
      }
      const firstIndex = facilities.indexOf(facility);
      const lastIndex = facilities.lastIndexOf(facility);
      // only
      return firstIndex !== lastIndex && lastIndex === currentIndex;
    });
    if (hasDuplicate) {
      errors.addError(errorMessages.evidence.uniquePrivate);
    }
  }
};
