import { isValidUSZipCode } from 'platform/forms/address';

import { errorMessages, REGEX_EMPTY_DATE } from '../constants';
import { validateDate } from './date';

import { MAX_LENGTH } from '../../shared/constants';
import { fixDateFormat } from '../../shared/utils/replace';
import {
  validateAddressParts,
  validateIssues,
  validateToDate,
  validateUniqueLocationOrFacility,
} from '../../shared/validations/evidence';

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
  validateIssues(
    errors,
    _data,
    fullData,
    _schema,
    _uiSchema,
    currentIndex,
    'locations',
  );
};

// Overloading fullDate parameter with evidence date type to control error
// messaging
export const validateVaFromDate = (errors, data) =>
  validateDate(errors, data.evidenceDates?.from, { dateType: 'evidence' });

export const validateVaToDate = (errors, data) => {
  validateToDate(errors, data, 'evidenceDates');
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

  validateUniqueLocationOrFacility(currentIndex, errors, 'uniqueVA', locations);
};

/* *** Private *** */
export const validatePrivateName = (errors, data) => {
  const { providerFacilityName } = data || {};
  if (!providerFacilityName) {
    errors.addError(errorMessages.evidence.facilityMissing);
  }
};

export const validateCountry = (errors, data) => {
  validateAddressParts(errors, data, 'country');
};
export const validateStreet = (errors, data) => {
  validateAddressParts(errors, data, 'street');
};
export const validateCity = (errors, data) => {
  validateAddressParts(errors, data, 'city');
};
export const validateState = (errors, data) => {
  validateAddressParts(errors, data, 'state');
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
  _data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  validateIssues(
    errors,
    _data,
    fullData,
    _schema,
    _uiSchema,
    currentIndex,
    'providerFacility',
  );
};

// Overloading fullDate parameter with evidence date type to control error
// messaging
export const validatePrivateFromDate = (errors, data) =>
  validateDate(errors, data.treatmentDateRange?.from, { dateType: 'evidence' });

export const validatePrivateToDate = (errors, data) => {
  validateToDate(errors, data, 'treatmentDateRange');
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
  validateUniqueLocationOrFacility(
    currentIndex,
    errors,
    'uniquePrivate',
    facilities,
  );
};
