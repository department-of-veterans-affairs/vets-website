import { isValidUSZipCode } from 'platform/forms/address';
import { errorMessages } from '../constants';
import { validateDate, validateYMDate } from './date';
import { MAX_LENGTH, REGEXP } from '../../shared/constants';
import { fixDateFormat } from '../../shared/utils/dates';
import {
  validateAddressParts,
  validateIssues,
  validateToDate,
  validateUniqueLocationOrFacility,
} from '../../shared/validations/evidence';
import sharedErrorMessages from '../../shared/content/errorMessages';

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

export const validateVaDate = (errors, data, _schema, _uiSchema, _index) =>
  validateYMDate(errors, data.treatmentDate);

export const buildVaLocationString = ({
  data = {},
  joiner = '',
  includeIssues = true,
  wrapped = false,
} = {}) => {
  const issues = includeIssues ? sortIssues(data.issues || []) : [];
  const noDate = (wrapped ? data.noTreatmentDates : data.noDate) || false;
  const treatmentDate = (data.treatmentDate || '').replace(
    REGEXP.EMPTY_DATE,
    '',
  );

  return [
    data.locationAndName || '',
    ...issues,
    fixDateFormat(!noDate && treatmentDate ? `${treatmentDate}-01` : ''),
    noDate,
  ].join(joiner);
};

// Check if VA evidence object is empty
export const isEmptyVaEntry = (data = {}) => {
  return buildVaLocationString({ data }).trim() === 'false';
};

export const validateVaUnique = (
  errors,
  _data,
  fullData,
  _schema,
  _uiSchema,
  currentIndex = 0,
) => {
  const locations = (fullData?.locations || []).map(data =>
    buildVaLocationString({
      data,
      joiner: ',',
      includeIssues: true,
    }).toLowerCase(),
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
    errors.addError(sharedErrorMessages.postal);
  } else if (!isValidUSZipCode(postalCode)) {
    errors.addError(sharedErrorMessages.zip);
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
      REGEXP.EMPTY_DATE,
      '',
    ),
    fixDateFormat(data.treatmentDateRange?.to || '').replace(
      REGEXP.EMPTY_DATE,
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
