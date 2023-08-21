// feature flag for form update
export const SHOW_PART3 = 'view:showPart3';

export const CONTESTABLE_ISSUES_API =
  '/notice_of_disagreements/contestable_issues';

// Values from Lighthouse maintained schema v1
// see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v1/10182.json
export const MAX_LENGTH = {
  ISSUE_NAME: 180,
  EMAIL: 255,
  COUNTRY_CODE: 3,
  AREA_CODE: 4,
  PHONE_NUMBER: 14,
  PHONE_NUMBER_EXT: 10,
  ADDRESS_LINE1: 60,
  ADDRESS_LINE2: 30,
  ADDRESS_LINE3: 10,
  CITY: 60,
  COUNTRY: 2,
  ZIP_CODE5: 5,
  POSTAL_CODE: 16,
  REP_NAME: 120,
  EXTENSION_REASON: 2300, // in v2 schema
};

export const REVIEW_ISSUES = 'onReviewPageIssues';

export const CONTESTABLE_ISSUES_PATH = 'contestable-issues';
