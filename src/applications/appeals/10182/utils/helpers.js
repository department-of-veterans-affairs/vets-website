// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SELECTED } from '../constants';

export const someSelected = issues =>
  (issues || []).some(issue => issue[SELECTED]);

// checks
export const hasRepresentative = formData => formData['view:hasRep'];
export const canUploadEvidence = formData =>
  formData.boardReviewOption === 'evidence_submission';
export const needsHearingType = formData =>
  formData.boardReviewOption === 'hearing';
export const wantsToUploadEvidence = formData =>
  canUploadEvidence(formData) && formData['view:additionalEvidence'];

export const hasSomeSelected = ({
  contestableIssues = [],
  additionalIssues = [],
}) => someSelected(contestableIssues) || someSelected(additionalIssues);
export const showAddIssueQuestion = formData => hasSomeSelected(formData);
export const showAddIssues = formData => formData['view:hasIssuesToAdd'];

export const noticeOfDisagreementFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form10182Nod];

export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const setInitialEditMode = formData =>
  formData.map(({ issue, decisionDate } = {}) => !issue || !decisionDate);

export const appStateSelector = state => ({
  // Validation functions are provided the pageData and not the
  // formData on the review & submit page. For more details
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
  contestableIssues: state.form?.data?.contestableIssues || [],
  additionalIssues: state.form?.data?.additionalIssues || [],
});
