import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
  MST_OPTION,
  VA_TREATMENT_BEFORE_2005_KEY,
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
export const getVAEvidence = formData =>
  (hasVAEvidence(formData) && formData?.locations) || [];
export const getPrivateEvidence = formData =>
  (hasPrivateEvidence(formData) && formData?.providerFacility) || [];
export const getOtherEvidence = formData =>
  (hasOtherEvidence(formData) && formData?.additionalDocuments) || [];
export const getArrayBuilderVAEvidence = formData => formData?.vaEvidence || [];
export const getArrayBuilderPrivateEvidence = formData =>
  formData?.privateEvidence || [];

// VA Evidence List & Loop
export const hasTreatmentBefore2005 = (formData, index) =>
  formData?.vaEvidence?.[index]?.[VA_TREATMENT_BEFORE_2005_KEY] === 'Y';
