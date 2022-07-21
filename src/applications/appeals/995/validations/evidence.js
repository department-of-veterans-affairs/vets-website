import { errorMessages } from '../constants';

export const validateEvidenceType = (errors, formData) => {
  if (
    !formData?.['view:hasVaEvidence'] &&
    !formData?.['view:hasPrivateEvidence'] &&
    !formData?.['view:hasOtherEvidence']
  ) {
    errors.addError(errorMessages.evidenceTypeMissing);
  }
};
