import moment from 'moment';

import { LEGACY_TYPE } from '../constants';

import {
  getIssueName,
  getSelected,
  processContestableIssues,
} from '../../shared/utils/issues';
import '../../shared/definitions';

/**
 * Determine if we're in the v1 flow using the save-in-progress data
 * @param {*} formData
 * @returns boolean
 */
export const isVersion1Data = formData => !!formData?.zipCode5;

/**
 * Filter out ineligible contestable issues:
 * - remove issues more than one year past their decision date
 * - remove issues that are deferred
 * @param {ContestableIssues} - Array of both eligible & ineligible contestable
 *  issues, plus legacy issues
 * @return {ContestableIssues} - filtered list
 */
export const getEligibleContestableIssues = issues => {
  const today = moment().startOf('day');
  const result = (issues || []).filter(issue => {
    const {
      approxDecisionDate = '',
      ratingIssueSubjectText = '',
      description = '',
    } = issue?.attributes || {};

    const isDeferred = [ratingIssueSubjectText, description]
      .join(' ')
      .includes('deferred');
    const date = moment(approxDecisionDate);
    if (isDeferred || !date.isValid() || !ratingIssueSubjectText) {
      return false;
    }
    return date.add(1, 'years').isAfter(today);
  });
  return processContestableIssues(result);
};

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

/**
 * Are there any legacy appeals in the API, or did the Veteran manually add an
 * issue of unknown legacy status?
 * @param {Number} legacyCount - legacy appeal array size
 * @returns {Boolean}
 */
export const mayHaveLegacyAppeals = ({
  legacyCount = 0,
  additionalIssues,
} = {}) => legacyCount > 0 || additionalIssues?.length > 0;

// additionalIssues (items) are separate because we're checking the count before
// the formData is updated
export const getSelectedCount = (formData, items) =>
  getSelected({ ...formData, additionalIssues: items }).length;

/**
 * Get issue name/title from either a manually added issue or issue loaded from
 * the API
 * @param {AdditionalIssueItem|ContestableIssueItem}
 */

export const getIssueDate = (entry = {}) =>
  entry.decisionDate || entry.attributes?.approxDecisionDate || '';

export const getIssueNameAndDate = (entry = {}) =>
  `${(getIssueName(entry) || '').toLowerCase()}${entry.decisionDate ||
    entry.attributes?.approxDecisionDate ||
    ''}`;

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

// Simple one level deep check
export const isEmptyObject = obj =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.keys(obj)?.length === 0 || false
    : false;

export const appStateSelector = state => ({
  // Validation functions are provided the pageData and not the
  // formData on the review & submit page. For more details
  // see https://dsva.slack.com/archives/CBU0KDSB1/p1614182869206900
  contestedIssues: state.form?.data?.contestedIssues || [],
  additionalIssues: state.form?.data?.additionalIssues || [],
});

export const getItemSchema = (schema, index) => {
  const itemSchema = schema;
  if (itemSchema.items.length > index) {
    return itemSchema.items[index];
  }
  return itemSchema.additionalItems;
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

/**
 * Return a phone number object
 * @param {String} phone - phone number string to convert to an object
 * @return {phoneObject}
 */
export const returnPhoneObject = phone => {
  const result = {
    countryCode: '',
    areaCode: '',
    phoneNumber: '',
    phoneNumberExt: '',
  };
  if (typeof phone === 'string' && phone?.length === 10) {
    result.countryCode = '1';
    result.areaCode = phone.slice(0, 3);
    result.phoneNumber = phone.slice(-7);
  }
  return result;
};
