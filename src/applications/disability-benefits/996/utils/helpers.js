import moment from 'moment';

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
