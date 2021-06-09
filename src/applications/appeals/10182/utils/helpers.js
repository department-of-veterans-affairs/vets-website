// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SELECTED } from '../constants';
import { isValidDate } from '../validations';

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
export const showAddIssuesPage = formData =>
  formData['view:hasIssuesToAdd'] !== false &&
  (formData.constestableIssues?.length
    ? !someSelected(formData.contestableIssues)
    : true);
export const otherTypeSelected = ({ areaOfDisagreement } = {}, index) =>
  areaOfDisagreement?.[index]?.disagreementOptions?.other;

export const hasSomeSelected = ({ contestableIssues, additionalIssues } = {}) =>
  someSelected(contestableIssues) || someSelected(additionalIssues);
export const showAddIssueQuestion = ({ contestableIssues }) =>
  // additional issues yes/no question:
  // SHOW: if contestable issues selected. HIDE: if no contestable issues are
  // selected or, there are no contestable issues
  contestableIssues?.length ? someSelected(contestableIssues) : false;

export const getSelected = ({ contestableIssues, additionalIssues } = {}) =>
  (contestableIssues || [])
    .filter(issue => issue[SELECTED])
    .concat((additionalIssues || []).filter(issue => issue[SELECTED]))
    // include index to help with error messaging
    .map((issue, index) => ({ ...issue, index }));

export const getIssueName = (entry = {}) =>
  entry.issue || entry.attributes?.ratingIssueSubjectText;

// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const setInitialEditMode = (formData = []) =>
  formData.map(
    ({ issue, decisionDate } = {}) =>
      !issue || !decisionDate || !isValidDate(decisionDate),
  );

export const issuesNeedUpdating = (loadedIssues = [], existingIssues = []) => {
  if (loadedIssues.length !== existingIssues.length) {
    return true;
  }
  return !loadedIssues.every(({ attributes }, index) => {
    const existing = existingIssues[index]?.attributes || {};
    return (
      attributes.ratingIssueSubjectText === existing.ratingIssueSubjectText &&
      attributes.approxDecisionDate === existing.approxDecisionDate
    );
  });
};

export const copyAreaOfDisagreementOptions = (newIssues, existingIssues) => {
  return newIssues.map(issue => {
    const foundIssue = (existingIssues || []).find(
      entry => getIssueName(entry) === getIssueName(issue),
    );
    if (foundIssue) {
      const { disagreementOptions = {}, otherEntry = '' } = foundIssue;
      return {
        ...issue,
        disagreementOptions,
        otherEntry,
      };
    }
    return issue;
  });
};

export const appStateSelector = state => ({
  // Validation functions are provided the pageData and not the
  // formData on the review & submit page. For more details
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
  contestableIssues: state.form?.data?.contestableIssues || [],
  additionalIssues: state.form?.data?.additionalIssues || [],
});

export const noticeOfDisagreementFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form10182Nod];

export const getItemSchema = (schema, index) => {
  const itemSchema = schema;
  if (itemSchema.items.length > index) {
    return itemSchema.items[index];
  }
  return itemSchema.additionalItems;
};
