// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SELECTED } from '../constants';

// checks
export const hasRepresentative = formData => formData['view:hasRep'];
export const canUploadEvidence = formData =>
  formData.boardReviewOption === 'evidence_submission';
export const needsHearingType = formData =>
  formData.boardReviewOption === 'hearing';
export const wantsToUploadEvidence = formData =>
  canUploadEvidence(formData) && formData['view:additionalEvidence'];
export const someSelected = issues =>
  (issues || []).some(issue => issue[SELECTED]);

export const noticeOfDisagreementFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form10182Nod];

export const isEmptyObject = obj => Object.keys(obj || {}).length === 0;

export const setInitialEditMode = formData =>
  formData.map(
    ({ issue, decisionDate } = {}, index) =>
      index >= 0 && (!issue || !decisionDate),
  );
