import moment from 'moment';

import { SELECTED } from '../constants';
import { isValidDate } from '../validations/issues';

/**
 * Check HLR v2 feature flag
 * @param {boolean} hlrV2
 * @returns boolean
 */
export const apiVersion2 = formData => formData?.hlrV2;
/**
 * Return the opposite of the HLR v2 feature flag
 * @param {boolean} hlrV2
 * @returns boolean
 */
export const apiVersion1 = formData => !formData?.hlrV2;

/**
 * Determine if we're in the v1 flow using the save-in-progress data
 * @param {*} formData
 * @returns boolean
 */
export const isVersion1Data = formData => !!formData?.zipCode5;

/**
 * @typedef ContestableIssues
 * @type {Array<Object>}
 * @property {ContestableIssueItem}
 */
/**
 * @typedef ContestableIssueItem
 * @type {Object}
 * @property {String} type - always set to "contestableIssue"
 * @property {ContestableIssueAttributes} attributes - essential properties
 * @property {Boolean} 'view:selected' - internal boolean indicating that the
 *   issue has been selected by the user
 */
/**
 * @typedef ContestableIssueAttributes
 * @type {Object}
 * @property {String} ratingIssueSubjectText - title of issue
 * @property {String} description - issue description
 * @property {Number} ratingIssuePercentNumber - disability rating percentage
 * @property {String} approxDecisionDate - decision date (YYYY-MM-DD)
 * @property {Number} decisionIssueId - decision id
 * @property {String} ratingIssueReferenceId - issue reference number
 * @property {String} ratingDecisionReferenceId - decision reference id
 */
/**
 * @typedef AdditionalIssues
 * @type {Array<Object>}
 * @property {AdditionalIssueItem}
 */
/**
 * @typedef AdditionalIssueItem
 * @type {Object}
 * @property {String} issue - title of issue
 * @property {String} decisionDate - decision date (YYYY-MM-DD)
 * @returns
 */
/** Filter out ineligible contestable issues:
 * - remove issues more than one year past their decision date
 * - remove issues that are deferred
 * @prop {ContestableIssues} - Array of both eligible & ineligible contestable
 *  issues
 */
export const getEligibleContestableIssues = issues => {
  const today = moment().startOf('day');
  return (issues || []).filter(issue => {
    const {
      approxDecisionDate = '',
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    const date = moment(approxDecisionDate);
    if (isDeferred || !date.isValid()) {
      return false;
    }
    return date.add(1, 'years').isAfter(today);
  });
};

/**
 * Get issue name/title from either a manually added issue or issue loaded from
 * the API
 * @param {AdditionalIssueItem|ContestableIssueItem}
 */
export const getIssueName = (entry = {}) =>
  entry.issue || entry.attributes?.ratingIssueSubjectText;

export const getIssueNameAndDate = (entry = {}) =>
  `${(getIssueName(entry) || '').toLowerCase()}${entry.decisionDate ||
    entry.attributes?.approxDecisionDate ||
    ''}`;

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

export const appStateSelector = state => ({
  // Validation functions are provided the pageData and not the
  // formData on the review & submit page. For more details
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
  contestedIssues: state.form?.data?.contestedIssues || [],
  additionalIssues: state.form?.data?.additionalIssues || [],
});

export const someSelected = issues =>
  (issues || []).some(issue => issue[SELECTED]);

export const hasSomeSelected = ({ contestedIssues, additionalIssues } = {}) =>
  someSelected(contestedIssues) || someSelected(additionalIssues);

export const showAddIssuesPage = formData => {
  const hasSelectedIssues = formData.contestedIssues?.length
    ? someSelected(formData.contestedIssues)
    : false;
  const noneToAdd = formData['view:hasIssuesToAdd'] !== false;
  // are we past the informal conference page?
  if (formData.informalConference && !hasSomeSelected(formData)) {
    // nothing is selected, we need to show the additional issues page!
    return true;
  }
  return noneToAdd || !hasSelectedIssues;
};

export const showAddIssueQuestion = ({ contestedIssues }) =>
  // additional issues yes/no question:
  // SHOW: if contestable issues selected. HIDE: if no contestable issues are
  // selected or, there are no contestable issues
  contestedIssues?.length ? someSelected(contestedIssues) : false;

export const getSelected = formData => {
  const eligibleIssues = (formData?.contestedIssues || []).filter(
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

const processIssues = (array = []) =>
  array.filter(Boolean).map(entry => getIssueNameAndDate(entry));

export const hasDuplicates = (data = {}) => {
  const contestedIssues = processIssues(data.contestedIssues);
  const additionalIssues = processIssues(data.additionalIssues);
  // ignore duplicate contestable issues (if any)
  const fullList = [...new Set(contestedIssues)].concat(additionalIssues);

  return fullList.length !== new Set(fullList).size;
};

// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const setInitialEditMode = (formData = {}) => {
  const contestedIssues = (formData.contestedIssues || []).map(entry =>
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

export const getItemSchema = (schema, index) => {
  const itemSchema = schema;
  if (itemSchema.items.length > index) {
    return itemSchema.items[index];
  }
  return itemSchema.additionalItems;
};
