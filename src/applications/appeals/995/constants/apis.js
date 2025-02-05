/**
 * NOTE: If any of these API values change, please update the documentation:
 * https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/products/decision-reviews/Supplemental-Claims/engineering/SC_frontend_backend_interactions.md
 */
export const NEW_API = 'decisionReviewScNewApi';

// Not shown is the `{benefit_type}` suffix
export const CONTESTABLE_ISSUES_API =
  '/v1/supplemental_claims/contestable_issues';

// Evidence upload API - same endpoint as NOD
export const EVIDENCE_UPLOAD_API = '/v1/decision_review_evidence';

export const SUBMIT_URL = '/v1/supplemental_claims';

// Not shown are the `v#` prefix and `{benefit_type}` suffix
// Our team does not own this endpoint, so it's not included in the
// modularization
export const ITF_API = '/v0/intent_to_file';

/**
 * New modularized API behind feature toggle: decision_review_sc_new_api
 * The endpoint will be the same until the backend has completed modularization
 */
export const CONTESTABLE_ISSUES_API_NEW =
  '/decision_reviews/v1/supplemental_claims/contestable_issues';

// Evidence upload API - same endpoint as NOD
export const EVIDENCE_UPLOAD_API_NEW =
  '/decision_reviews/v1/decision_review_evidence';

export const SUBMIT_URL_NEW = '/decision_reviews/v1/supplemental_claims';
