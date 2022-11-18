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

export const validateVaFromDate = (errors, data) =>
  validateDate(errors, data.evidenceDates?.from, 'evidence');

export const validateVaToDate = (errors, data) => {
  const dates = data.evidenceDates || {};
  validateDate(errors, dates?.to, 'evidence');

  // modified from validateDateRange
  const fromDate = convertToDateField(dates?.from);
  const toDate = convertToDateField(dates?.to);

  if (!isValidDateRange(fromDate, toDate, true)) {
    errors.addError(errorMessages.endDateBeforeStart);
  }
};

export function isValidZIP(value) {
  if (value !== null) {
    return /^\d{5}(?:(?:[-\s])?\d{4})?$/.test(value);
  }
  return true;
}

export function validateZIP(errors, zip) {
  if (zip && !isValidZIP(zip)) {
    errors.addError(
      'Please enter a valid 5- or 9-digit postal code (dashes allowed)',
    );
  }
}
