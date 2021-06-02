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

// key for contestableIssues to indicate that the user selected the issue
export const SELECTED = 'view:selected';

export const CONTESTABLE_ISSUES_API =
  '/notice_of_disagreements/contestable_issues';

export const FORMAT_READABLE = 'LL';

// contested issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';

export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

export const MAX_NEW_CONDITIONS = 99;

// see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v1/10182.json
export const MAX_ISSUE_LENGTH = 180;
export const MAX_REP_NAME_LENGTH = 120;
export const MAX_DISAGREEMENT_REASON_LENGTH = 90;
