import React from 'react';

// import the toggleValues helper
import { LEGACY_TYPE, REGEXP, SELECTED } from '../constants';

import { replaceDescriptionContent } from './replace';
import '../definitions';

/**
 * Get issue name/title from either a manually added issue or issue loaded from
 * the API
 * @param {AdditionalIssueItem|ContestableIssueItem}
 */
export const getIssueName = (entry = {}) =>
  entry.issue || entry.attributes?.ratingIssueSubjectText;

export const getIssueDate = (entry = {}) =>
  entry.decisionDate || entry.attributes?.approxDecisionDate || '';

// used for string comparison
export const getIssueNameAndDate = (entry = {}) =>
  `${(getIssueName(entry) || '').toLowerCase()}${getIssueDate(entry)}`;

/*
 * Selected issues helpers
 */
export const someSelected = issues =>
  (issues || []).some(issue => issue[SELECTED]);

export const hasSomeSelected = ({ contestedIssues, additionalIssues } = {}) =>
  someSelected(contestedIssues) || someSelected(additionalIssues);

export const getSelected = formData => {
  const contestedIssues = (formData?.contestedIssues || []).filter(
    issue => issue[SELECTED],
  );
  const additionalIssues = (formData?.additionalIssues || []).filter(
    issue => issue[SELECTED],
  );
  // include index to help with error messaging
  return contestedIssues.concat(additionalIssues).map((issue, index) => ({
    ...issue,
    index,
  }));
};

/**
 * Issues Listed on Confirmation Page
 */
export const getIssuesListItems = data =>
  getSelected(data || []).map((issue, index) => (
    <li key={index} className="vads-u-margin-bottom--0">
      <span className="dd-privacy-hidden" data-dd-action-name="issue name">
        {getIssueName(issue)}
      </span>
    </li>
  ));

// additionalIssues (items) are separate because we're checking the count before
// the formData is updated
export const getSelectedCount = (formData, items) =>
  getSelected({ ...formData, additionalIssues: items }).length;

const processIssues = (array = []) =>
  array
    .filter(entry => getIssueName(entry) && getIssueDate(entry))
    .map(entry => getIssueNameAndDate(entry));

export const hasDuplicates = (data = {}) => {
  const contestedIssues = processIssues(data.contestedIssues);
  const additionalIssues = processIssues(data.additionalIssues);
  // ignore duplicate contestable issues (if any)
  const fullList = [...new Set(contestedIssues)].concat(additionalIssues);

  return fullList.length !== new Set(fullList).size;
};

/**
 * Removes deferred issues and issues > 1 year past their decision date. This
 * function removes issues with no title, cleans up whitespace & sorts the list
 * by descending (newest first) decision date, then ensures the list only
 * includes unique entries
 * @param {ContestableIssues} contestableIssues
 * @returns {ContestableIssues} Cleaned up & sorted list
 *  of contestable issues
 */
export const processContestableIssues = contestableIssues => {
  const processDate = entry =>
    (entry.attributes?.approxDecisionDate || '').replace(REGEXP.DASH, '');
  // remove issues with no title & sort by date - see
  // https://dsva.slack.com/archives/CSKKUL36K/p1623956682119300
  const result = (contestableIssues || [])
    .filter(issue => getIssueName(issue))
    .map(issue => {
      const attr = issue.attributes;
      return {
        ...issue,
        attributes: {
          ...attr,
          ratingIssueSubjectText: replaceDescriptionContent(
            attr.ratingIssueSubjectText,
          ),
          description: replaceDescriptionContent(attr?.description || ''),
        },
      };
    })
    .sort((a, b) => {
      const dateA = processDate(a);
      const dateB = processDate(b);
      if (dateA === dateB) {
        // If the dates are the same, sort by title
        return getIssueName(a) > getIssueName(b) ? 1 : -1;
      }
      // YYYYMMDD string comparisons will work in place of using moment
      return dateA > dateB ? -1 : 1;
    });

  // Return unique contestable issues
  return [
    ...new Map(
      result.map(issue => [getIssueNameAndDate(issue), issue]),
    ).values(),
  ];
};

/**
 * Calculate the index offset for the additional issue
 * @param {Number} index - index of data in combined array of contestable issues
 *   and additional issues
 * @param {Number} contestableIssuesLength - contestable issues array length
 * @returns {Number}
 */
export const calculateIndexOffset = (index, contestableIssuesLength) =>
  index - contestableIssuesLength;

export const issuesNeedUpdating = (loaded = [], formIssues = []) => {
  const loadedIssues = processContestableIssues(loaded);
  const existingIssues = processContestableIssues(formIssues);
  return loadedIssues.length !== existingIssues.length
    ? true
    : !loadedIssues.every(({ attributes }, index) => {
        const existing = existingIssues[index]?.attributes;
        return (
          attributes.ratingIssueSubjectText ===
            existing.ratingIssueSubjectText &&
          attributes.approxDecisionDate === existing.approxDecisionDate
        );
      });
};

/**
 * Filters out duplicate issue
 * @param {ContestableIssueSubmittable} issues - Array of processed issues,
 *  ready for submission
 * @returns {ContestableIssueSubmittable} - unique list of issues
 */
export const returnUniqueIssues = issues => [
  ...new Map(
    issues.map(issue => {
      const attr = issue.attributes;
      return [`${attr.issue}-${attr.decisionDate}`, issue];
    }),
  ).values(),
];

export const appStateSelector = state => ({
  // Validation functions are provided the pageData and not the
  // formData on the review & submit page. For more details
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
  contestedIssues: state.form?.data?.contestedIssues || [],
  additionalIssues: state.form?.data?.additionalIssues || [],
});

/**
 * Find legacy appeal array included with contestable issues & return length
 * Note: we are using the length of this array instead of trying to do a 1:1
 * coorelation of contestable issues to legacy issues since we're only getting a
 * summary and not a matching name or date (at least in the mock data).
 * @param {ContestableIssues} issues - Array of both eligible & ineligible
 *  contestable issues, plus legacy issues
 * @return {Number} - length of legacy array
 */
export const getLegacyAppealsLength = issues =>
  (issues || []).reduce((count, issue) => {
    if (issue.type === LEGACY_TYPE) {
      // add just-in-case there is more than one legacy type entry
      return count + (issue.attributes?.issues?.length || 0);
    }
    return count;
  }, 0);
