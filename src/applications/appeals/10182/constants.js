export const APP_NAME = 'Notice of Disagreement';

// feature flag for form update
export const SHOW_PART3 = 'view:showPart3';

export const CONTESTABLE_ISSUES_API =
  '/notice_of_disagreements/contestable_issues';

// Values from Lighthouse maintained schema v1
// see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v1/10182.json
export const NOD_MAX_LENGTH = {
  NOD_ISSUE_NAME: 180,
  REP_NAME: 120, // is REP_NAME used at all?
  EXTENSION_REASON: 2300, // in v2 schema
};

export const REVIEW_ISSUES = 'onReviewPageIssues';

export const CONTESTABLE_ISSUES_PATH = 'contestable-issues';
