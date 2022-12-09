import { convertToDateField } from 'platform/forms-system/src/js/validation';
import { isValidDateRange } from 'platform/forms-system/src/js/utilities/validations';

import {
  errorMessages,
  MAX_LENGTH,
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_OTHER,
} from '../constants';
import { validateDate } from './date';

export const validateEvidence = (errors, formData) => {
  const va = formData?.[EVIDENCE_VA];
  const priv8 = formData?.[EVIDENCE_PRIVATE];
  const other = formData?.[EVIDENCE_OTHER];
  if (
    (!va || (va && !formData.locations?.length)) &&
    (!priv8 || (priv8 && !formData.providerFacility?.length)) &&
    (!other || (other && !formData.additionalDocuments?.length))
  ) {
    errors.addError(errorMessages.evidence.missing);
  }
};

export function validateVaLocation(errors, data) {
  const { locationAndName } = data || {};
  if (!locationAndName) {
    errors.addError(errorMessages.evidence.locationMissing);
  } else if (locationAndName.length > MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME) {
    errors.addError(errorMessages.evidence.locationMaxLength);
  }
}

export function validateVaIssues(errors, data) {
  if (!data.issues?.length) {
    errors.addError(errorMessages.evidence.issuesMissing);
  }
}

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

const REGEX_ZIP = /^\d{5}(([-\s])\d{4})?$/;
export const isValidZip = (value = null) =>
  value !== null ? REGEX_ZIP.test(value) : false;

export const validateZip = (errors, zip) => {
  if (zip && !isValidZip(zip)) {
    errors.addError(errorMessages.invalidZip);
  }
};

export const validateVaUnique = (errors, _data, fullData) => {
  const locations = (fullData?.locations || []).map(
    ({ locationAndName, issues = [], evidenceDates = {} } = {}) =>
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
  if (locations.length !== uniqueLocations.size) {
    errors.addError(errorMessages.evidence.unique);
  }
};
