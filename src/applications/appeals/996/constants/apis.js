/**
 * NOTE: If any of these API values change, please update the documentation:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/decision-reviews/higher-level-review/engineering/HLR_frontend_backend_interactions.md
 */

export const NEW_API = 'decisionReviewHlrNewApi';

// Not shown is the `{benefit_type}` suffix
export const CONTESTABLE_ISSUES_API =
  '/v1/higher_level_reviews/contestable_issues';

export const SUBMIT_URL = '/v2/higher_level_reviews';

/**
 * New modularized API behind feature toggle: decision_review_sc_new_api
 * The endpoint will be the same until the backend has completed modularization
 */
export const CONTESTABLE_ISSUES_API_NEW =
  '/decision_reviews/v1/higher_level_reviews/contestable_issues';

export const SUBMIT_URL_NEW = '/decision_reviews/v2/higher_level_reviews';
