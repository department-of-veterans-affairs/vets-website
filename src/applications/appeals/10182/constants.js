export const NOD_INFO_URL = '/decision-reviews/board-appeal/';

// Same as "rootUrl" in manifest.json
export const BASE_URL = `${NOD_INFO_URL}request-board-appeal-form-10182`;

export const FORM_URL = 'https://www.va.gov/vaforms/va/pdf/VA10182.pdf';

export const PROFILE_URL = '/profile';
export const DECISION_REVIEWS_URL = '/decision-reviews/';
export const FACILITY_LOCATOR_URL = '/find-locations';
export const CONTESTED_CLAIMS_URL = '/decision-reviews/contested-claims';
export const BOARD_APPEAL_OPTIONS_URL =
  '/decision-reviews/board-appeal/#what-are-my-board-appeal-optio';
export const GET_HELP_REQUEST_URL =
  '/decision-reviews/get-help-with-review-request';

// feature flag for form update
export const SHOW_PART3 = 'view:showPart3';

export const CONTESTABLE_ISSUES_API =
  '/notice_of_disagreements/contestable_issues';

export const FORMAT_READABLE = 'LL';

// contestable issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';

// NOD update (Part III, box 11) allows for past decision dates, but we should
// limit them. Picking 100 years until told otherwise
export const MAX_YEARS_PAST = 100;

export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

export const REVIEW_ISSUES = 'onReviewPageIssues';

export const CONTESTABLE_ISSUES_PATH = 'contestable-issues';
