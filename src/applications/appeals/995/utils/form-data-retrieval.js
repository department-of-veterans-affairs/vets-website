import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
  MST_OPTION,
  VA_EVIDENCE_PROMPT_KEY,
  VA_TREATMENT_BEFORE_2005_KEY,
  PRIVATE_EVIDENCE_PROMPT_KEY,
} from '../constants';

export const hasPrivateEvidence = formData =>
  !!formData?.[HAS_PRIVATE_EVIDENCE];
export const hasPrivateLimitation = formData =>
  hasPrivateEvidence(formData) && !!formData?.[HAS_PRIVATE_LIMITATION];
export const hasVAEvidence = formData => formData?.[HAS_VA_EVIDENCE];
export const hasOtherEvidence = formData => formData?.[HAS_OTHER_EVIDENCE];
export const hasMstOption = formData => formData?.[MST_OPTION];
export const hasHousingRisk = formData => formData?.housingRisk;
export const hasOtherHousingRisk = formData =>
  !!(hasHousingRisk(formData) && formData?.livingSituation?.other);

// VA Evidence List & Loop
export const hasVAEvidenceRecords = formData =>
  formData?.[VA_EVIDENCE_PROMPT_KEY];
export const hasTreatmentBefore2005 = (formData, index) =>
  formData?.vaEvidence?.[index]?.[VA_TREATMENT_BEFORE_2005_KEY] === 'Y';

// Private Evidence List & Loop
export const hasPrivateEvidenceRecords = formData =>
  formData?.[PRIVATE_EVIDENCE_PROMPT_KEY];
