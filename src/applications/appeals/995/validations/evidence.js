import { errorMessages } from '../constants';
import { validateDate } from './date';

export const validateEvidenceType = (errors, formData) => {
  if (
    !formData?.['view:hasVaEvidence'] &&
    !formData?.['view:hasPrivateEvidence'] &&
    !formData?.['view:hasOtherEvidence']
  ) {
    errors.addError(errorMessages.evidenceTypeMissing);
  }
};

const validateDateRange = (errors, evidenceDates) => {
  (evidenceDates || [{}]).forEach((date, dateIndex) => {
    const dateError =
      errors.evidenceDates?.[dateIndex] || errors.evidenceDates || errors;
    validateDate(dateError.from || dateError, date.from);
    validateDate(dateError.to || dateError, date.to, date.from);
  });
};

export function validateVALocation(errors, formData) {
  formData.forEach(({ locationAndName, evidenceDates }, index) => {
    if (!locationAndName) {
      errors[index].locationAndName.addError(
        errorMessages.locationAndNameMissing,
      );
    }
    validateDateRange(errors[index] || errors, evidenceDates);
  });
}

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
