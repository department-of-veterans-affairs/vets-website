// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';
import { SELECTED } from '../constants';
import { isValidDate } from '../validations';

export const someSelected = issues =>
  (issues || []).some(issue => issue[SELECTED]);

// checks
export const canUploadEvidence = formData =>
  formData.boardReviewOption === 'evidence_submission';
export const needsHearingType = formData =>
  formData.boardReviewOption === 'hearing';
export const wantsToUploadEvidence = formData =>
  canUploadEvidence(formData) && formData['view:additionalEvidence'];

export const hasSomeSelected = ({ contestableIssues, additionalIssues } = {}) =>
  someSelected(contestableIssues) || someSelected(additionalIssues);

export const showAddIssuesPage = formData => {
  const hasSelectedIssues = formData.constestableIssues?.length
    ? someSelected(formData.contestableIssues)
    : false;
  const noneToAdd = formData['view:hasIssuesToAdd'] !== false;
  // are we past the issues pages?
  if (formData.boardReviewOption && !hasSomeSelected(formData)) {
    // nothing is selected, we need to show the additional issues page!
    return true;
  }
  return noneToAdd && !hasSelectedIssues;
};

export const showAddIssueQuestion = ({ contestableIssues }) =>
  // additional issues yes/no question:
  // SHOW: if contestable issues selected. HIDE: if no contestable issues are
  // selected or, there are no contestable issues
  contestableIssues?.length ? someSelected(contestableIssues) : false;

export const getSelected = formData => {
  const eligibleIssues = (formData?.contestableIssues || []).filter(
    issue => issue[SELECTED],
  );
  const addedIssues = formData['view:hasIssuesToAdd']
    ? (formData?.additionalIssues || []).filter(issue => issue[SELECTED])
    : [];
  // include index to help with error messaging
  return [...eligibleIssues, ...addedIssues].map((issue, index) => ({
    ...issue,
    index,
  }));
};

// additionalIssues (items) are separate because we're checking the count before
// the formData is updated
export const getSelectedCount = (formData, items) =>
  getSelected({ ...formData, additionalIssues: items }).length;

export const getIssueName = (entry = {}) =>
  entry.issue || entry.attributes?.ratingIssueSubjectText;

export const getIssueNameAndDate = (entry = {}) =>
  `${(getIssueName(entry) || '').toLowerCase()}${entry.decisionDate ||
    entry.attributes?.approxDecisionDate ||
    ''}`;

const processIssues = (array = []) =>
  array.filter(Boolean).map(entry => getIssueNameAndDate(entry));

export const hasDuplicates = (data = {}) => {
  const contestableIssues = processIssues(data.contestableIssues);
  const additionalIssues = processIssues(data.additionalIssues);
  // ignore duplicate contestable issues (if any)
  const fullList = [...new Set(contestableIssues)].concat(additionalIssues);

  return fullList.length !== new Set(fullList).size;
};

// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const setInitialEditMode = (formData = {}) => {
  const contestedIssues = (formData.contestableIssues || []).map(entry =>
    getIssueNameAndDate(entry),
  );
  const additionalIssues = (formData.additionalIssues || []).map(entry =>
    getIssueNameAndDate(entry),
  );
  return (formData.additionalIssues || []).map((issue = {}, index) => {
    const currentIssue = getIssueNameAndDate(issue);
    return (
      !issue.issue ||
      !issue.decisionDate ||
      !isValidDate(issue.decisionDate) ||
      // check for duplicates
      contestedIssues.includes(currentIssue) ||
      additionalIssues.lastIndexOf(currentIssue) !== index ||
      additionalIssues.indexOf(currentIssue) !== index
    );
  });
};

// getEligibleContestableIssues will remove deferred issues and issues > 1 year
// past their decision date. This function removes issues with no title & sorts
// the list by descending (newest first) decision date
export const processContestableIssues = contestableIssues => {
  const regexDash = /-/g;
  const getDate = entry =>
    (entry.attributes?.approxDecisionDate || '').replace(regexDash, '');

  // remove issues with no title & sort by date - see
  // https://dsva.slack.com/archives/CSKKUL36K/p1623956682119300
  return (contestableIssues || [])
    .filter(issue => getIssueName(issue))
    .sort((a, b) => {
      const dateA = getDate(a);
      const dateB = getDate(b);
      if (dateA === dateB) {
        // If the dates are the same, sort by title
        return getIssueName(a) > getIssueName(b) ? 1 : -1;
      }
      // YYYYMMDD string comparisons will work in place of using moment
      return dateA > dateB ? -1 : 1;
    });
};

export const issuesNeedUpdating = (loadedIssues = [], existingIssues = []) => {
  if (loadedIssues.length !== existingIssues.length) {
    return true;
  }
  // sort both arrays so we don't end up in an endless loop
  const issues = processContestableIssues(existingIssues);
  return !processContestableIssues(loadedIssues).every(
    ({ attributes }, index) => {
      const existing = issues[index]?.attributes || {};
      return (
        attributes.ratingIssueSubjectText === existing.ratingIssueSubjectText &&
        attributes.approxDecisionDate === existing.approxDecisionDate
      );
    },
  );
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

/**
 * Convert an array into a readable list of items
 * @param {String[]} list - Array of items. Empty entries are stripped out
 * @returns {String}
 * @example
 * readableList(['1', '2', '3', '4', 'five'])
 * // => '1, 2, 3, 4 and five'
 */
export const readableList = list => {
  const cleanedList = list.filter(Boolean);
  return [cleanedList.slice(0, -1).join(', '), cleanedList.slice(-1)[0]].join(
    cleanedList.length < 2 ? '' : ' and ',
  );
};
