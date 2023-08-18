/**
 **** KEYS ****
 */
// key for contestableIssues to indicate that the user selected the issue
export const SELECTED = 'view:selected';

/**
 **** INTERNAL FORM URL PATHS ****
 */
export const CONTACT_INFO_PATH = '/contact-information';

/**
 **** URL PATHS ****
 */
export const DR_URL = '/decision-reviews';
export const CONTESTED_CLAIMS_URL = `${DR_URL}/contested-claims`;
export const GET_HELP_REVIEW_REQUEST_URL = `${DR_URL}/get-help-with-review-request`;

export const SC_INFO_URL = `${DR_URL}/supplemental-claim`;
export const SC_BASE_URL = `${SC_INFO_URL}/file-supplemental-claim-form-20-0995`;
export const SC_OTHER_WAYS_URL = `${SC_INFO_URL}#file-by-mail-in-person-or-with`;
export const SC_FORM_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf';

export const HLR_INFO_URL = `${DR_URL}/higher-level-review`;
export const HLR_BASE_URL = `${HLR_INFO_URL}/request-higher-level-review-form-20-0996`;
// 8622 is the ID of the <va-accordion-item> with a header of the "Find
// addresses for other benefit types"
export const HLR_OTHER_WAYS_URL = `${HLR_INFO_URL}#find-addresses-for-other-benef-8622`;
export const HLR_FORM_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf';

export const NOD_INFO_URL = `${DR_URL}/board-appeal`;
export const NOD_BASE_URL = `${NOD_INFO_URL}/request-board-appeal-form-10182`;
export const NOD_OPTIONS_URL = `${NOD_INFO_URL}/#what-are-my-board-appeal-optio`;
export const NOD_FORM_URL = 'https://www.va.gov/vaforms/va/pdf/VA10182.pdf';

export const CLAIM_STATUS_TOOL_URL = '/claim-or-appeal-status';

export const COVID_FAQ_URL =
  'https://www.va.gov/coronavirus-veteran-frequently-asked-questions/#more-benefit-and-claim-questio';

export const FACILITY_LOCATOR_URL = '/find-locations';
export const PROFILE_URL = '/profile';

export const REVIEW_AND_SUBMIT = '/review-and-submit';

/**
 **** DATES ****
 */
// contested issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';
export const FORMAT_READABLE = 'LL';
export const FORMAT_COMPACT = 'MMM DD, YYYY';

// Limit past decision dates to 100 years until told otherwise
export const MAX_YEARS_PAST = 100;

export const AMA_DATE = '2019-02-19'; // Appeals Modernization Act in effect

/**
 **** UPLOADS ****
 */
export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

/**
 **** MAX LENGTH ****
 */

// Values from Lighthouse maintained schema v2
// see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json
export const MAX_LENGTH = {
  SELECTIONS: 100, // submitted issues (not in schema)
  ISSUE_NAME: 140,
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
  REP_FIRST_NAME: 30,
  REP_LAST_NAME: 40,
};

/**
 **** REGULAR EXPRESSIONS ****
 */
export const REGEXP = {
  APOSTROPHE: /\u2019/g,
  DASH: /-/g,
  PERCENT: /(\s|\b)percent(\s|\b)/gi,
  WHITESPACE: /\s+/g,
};

/**
 **** AREA OF DISAGREEMENTS ****
 */
export const DISAGREEMENT_TYPES = {
  serviceConnection: 'The service connection',
  effectiveDate: 'The effective date of award',
  evaluation: 'Your evaluation of my condition',
  otherEntry: 'Something else:',
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

// session storage keys
export const LAST_ISSUE = 'last-issue'; // focus management across pages
