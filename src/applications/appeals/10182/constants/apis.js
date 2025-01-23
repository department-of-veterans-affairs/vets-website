/**
 * NOTE: If any of these API values change, please update the documentation:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/decision-reviews/Notice-of-Disagreement/engineering/NOD_frontend_backend_interactions.md
 */
export const NEW_API = 'decisionReviewNodNewApi';

export const CONTESTABLE_ISSUES_API =
  '/v1/notice_of_disagreements/contestable_issues';

// Evidence upload API - same endpoint as Supplemental Claim
export const EVIDENCE_UPLOAD_API = '/v1/decision_review_evidence';

export const SUBMIT_URL = '/v1/notice_of_disagreements';

/**
 * New modularized API behind feature toggle: decision_review_nod_new_api
 * The endpoint will be the same until the backend has completed modularization
 */
export const CONTESTABLE_ISSUES_API_NEW =
  '/decision_reviews/v1/notice_of_disagreements/contestable_issues';

// Evidence upload API - same endpoint as Supplemental Claim
export const EVIDENCE_UPLOAD_API_NEW =
  '/decision_reviews/v1/decision_review_evidence';

export const SUBMIT_URL_NEW = '/decision_reviews/v1/notice_of_disagreements';
