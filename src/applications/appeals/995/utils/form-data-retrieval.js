import {
  EVIDENCE_OTHER,
  EVIDENCE_PRIVATE,
  EVIDENCE_VA,
  LIMITED_CONSENT_RESPONSE,
} from '../constants';

export const hasPrivateEvidence = formData => !!formData?.[EVIDENCE_PRIVATE];
export const hasPrivateLimitation = formData =>
  hasPrivateEvidence(formData) && !!formData?.[LIMITED_CONSENT_RESPONSE];
export const hasVAEvidence = formData => formData?.[EVIDENCE_VA];
export const hasOtherEvidence = formData => formData?.[EVIDENCE_OTHER];
