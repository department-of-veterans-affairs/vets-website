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

// contestable issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';

export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

// Values from Lighthouse maintained schema v1
// see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v1/10182.json
export const MAX_LENGTH = {
  SELECTIONS: 100, // submitted issues (not in schema)
  ISSUE_NAME: 180,
  DISAGREEMENT_REASON: 90,
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
  // EXTENSION_REASON: 2300, // in v2 schema
};

// Using MAX_LENGTH.DISAGREEMENT_REASON (90) and with all checkboxes selected,
// this string is submitted - the numbers constitute the "something else" typed
// in value
// "service connection,effective date,disability evaluation,1234567890123456789012345678901234"
export const SUBMITTED_DISAGREEMENTS = {
  serviceConnection: 'service connection',
  effectiveDate: 'effective date',
  evaluation: 'disability evaluation',
};

export const LAST_NOD_ITEM = 'lastNodItem'; // focus management across pages

export const contestableIssuesPath = 'contestable-issues';
