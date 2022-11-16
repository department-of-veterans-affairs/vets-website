import {
  errorMessages,
  MAX_LENGTH,
  EVIDENCE_VA,
  EVIDENCE_PRIVATE,
  EVIDENCE_OTHER,
} from '../constants';
import { validateDate } from './date';

export const validateEvidence = (errors, formData) => {
  if (
    !formData?.[EVIDENCE_VA] &&
    !formData?.[EVIDENCE_PRIVATE] &&
    !formData?.[EVIDENCE_OTHER]
  ) {
    errors.addError(errorMessages.evidenceMissing);
  }
};

export function validateVaLocation(errors, data) {
  const { locationAndName } = data || {};
  if (!locationAndName) {
    errors.addError(errorMessages.evidenceLocationMissing);
  } else if (locationAndName.length > MAX_LENGTH.EVIDENCE_LOCATION_AND_NAME) {
    errors.addError(errorMessages.evidenceLocationMaxLength);
  }
}

export function validateVaIssues(errors, data) {
  if (!data.issues?.length) {
    errors.addError(errorMessages.evidenceIssuesMissing);
  }
}

export const validateVaFromDate = (errors, data) =>
  validateDate(errors, data.evidenceDates?.from);

export const validateVaToDate = (errors, data) =>
  validateDate(errors, data.evidenceDates?.to);

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
