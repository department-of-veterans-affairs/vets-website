import {
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  LIMITED_CONSENT_RESPONSE,
  MST_OPTION,
} from '../constants';

export const hasPrivateEvidence = formData => !!formData?.[EVIDENCE_PRIVATE];
export const hasPrivateLimitation = formData =>
  hasPrivateEvidence(formData) && !!formData?.[LIMITED_CONSENT_RESPONSE];
export const hasVAEvidence = formData => formData?.[EVIDENCE_VA];
export const hasOtherEvidence = formData => formData?.[EVIDENCE_OTHER];
export const hasMstOption = formData => formData?.[MST_OPTION];
export const hasHousingRisk = formData => formData?.housingRisk;
export const hasOtherHousingRisk = formData =>
  !!(hasHousingRisk(formData) && formData?.livingSituation?.other);
