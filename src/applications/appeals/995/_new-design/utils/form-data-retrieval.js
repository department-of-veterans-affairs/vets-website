import {
  HAS_OTHER_EVIDENCE,
  HAS_PRIVATE_EVIDENCE,
  HAS_VA_EVIDENCE,
  HAS_PRIVATE_LIMITATION,
  MST_OPTION,
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
