import Scroll from 'react-scroll';
import moment from 'moment';

// import the toggleValues helper
import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const higherLevelReviewFeature = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.form996HigherLevelReview];

// testing
export const $ = (selector, DOM) => DOM.querySelector(selector);
export const $$ = (selector, DOM) => DOM.querySelectorAll(selector);

export const scrollTo = (target = 'topScrollElement') => {
  Scroll.scroller.scrollTo(target, {
    duration: 500,
    delay: 0,
    smooth: true,
  });
};

export const scrollToTop = scrollTo;

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
