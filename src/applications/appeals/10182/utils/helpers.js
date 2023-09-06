// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SHOW_PART3 } from '../constants';

// checks
export const canUploadEvidence = formData =>
  formData.boardReviewOption === 'evidence_submission';
export const needsHearingType = formData =>
  formData.boardReviewOption === 'hearing';
export const wantsToUploadEvidence = formData =>
  canUploadEvidence(formData) && formData['view:additionalEvidence'];

export const noticeOfDisagreementFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form10182Nod];

export const nodPart3UpdateFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.nodPart3Update];

export const showPart3 = formData => formData?.[SHOW_PART3];
export const showExtensionReason = formData =>
  showPart3(formData) && formData.requestingExtension;
