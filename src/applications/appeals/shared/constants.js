/**
 **** BENEFIT TYPES ****
 */
export const DEFAULT_BENEFIT_TYPE = 'compensation';

/**
 **** KEYS ****
 */
// key for contestableIssues to indicate that the user selected the issue
export const SELECTED = 'view:selected';

/**
 **** INTERNAL FORM URL PATHS ****
 */
export const CONTACT_INFO_PATH = '/contact-information';
export const CONTESTABLE_ISSUES_PATH = 'contestable-issues';

/**
 **** URL PATHS ****
 */
export const DR_URL = '/decision-reviews';
export const CONTESTED_CLAIMS_URL = `${DR_URL}/contested-claims`;
export const GET_HELP_REVIEW_REQUEST_URL = `${DR_URL}/get-help-with-review-request`;
export const SC_INFO_URL = `${DR_URL}/supplemental-claim`; // v2
export const SC_BASE_URL = `${SC_INFO_URL}/file-supplemental-claim-form-20-0995`;
export const SC_OTHER_WAYS_URL = `${SC_INFO_URL}#file-by-mail-in-person-or-with`;
export const SC_FORM_URL =
  'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf';

// TODO: placeholder while waiting for Lighthouse
export const NOD_PDF_DOWNLOAD_URL = '';

// session storage keys
export const REVIEW_ISSUES = 'onReviewPageIssues';

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

export const FACILITY_LOCATOR_URL = '/find-locations';
export const PROFILE_URL = '/profile';
export const HEALTH_BENEFITS_URL = '/health-care/about-va-health-benefits';
export const MST_INFO =
  '/health-care/health-needs-conditions/military-sexual-trauma/';
export const MST_COORD_URL =
  'https://www.mentalhealth.va.gov/msthome/vha-mst-coordinators.asp';

export const REVIEW_AND_SUBMIT = '/review-and-submit';

/**
 **** DATES ****
 */
// contested issue dates - date-fns formatting
export const FORMAT_YMD_DATE_FNS = 'yyyy-MM-dd';
export const FORMAT_COMPACT_DATE_FNS = 'MMM d, yyyy';
export const FORMAT_READABLE_DATE_FNS = 'MMMM d, yyyy';
export const FORMAT_READABLE_MMYY_DATE_FNS = 'MMMM yyyy';

// VA.gov style guide: months that should NOT be abbreviated in dates
// March, April, May, June, July stay as full month names
// Array contains month numbers (0-based): 2=March, 3=April, 4=May, 5=June, 6=July
// https://design.va.gov/content-style-guide/dates-and-numbers#dates
export const VA_LONG_FORM_MONTHS = [2, 3, 4, 5, 6];

// Supplemental Claim allows for past decision dates, but we should limit them.
// Limit past decision dates to 100 years until told otherwise
export const MAX_YEARS_PAST = 100;
export const LEGACY_TYPE = 'legacyAppeal';
export const AMA_DATE = '2019-02-19'; // Appeals Modernization Act in effect

/**
 **** UPLOADS ****
 */
export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 ** 2;

/**
 **** MAX LENGTH ****
 */

// Values from Lighthouse maintained schema v1 & v2
// v1 - see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v1/10182.json
// v2 - see https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/appeals_api/config/schemas/v2/200996.json
export const MAX_LENGTH = {
  // used in 995 and 996
  ISSUE_NAME: 140,
  EMAIL: 255,
  // used in 995 and 10182
  SELECTIONS: 100, // submitted issues (not in schema)
  // used in all 3 forms
  PHONE_COUNTRY_CODE: 3,
  PHONE_AREA_CODE: 4,
  PHONE_NUMBER: 14,
  PHONE_NUMBER_EXT: 10,
  ADDRESS_LINE1: 60,
  ADDRESS_LINE2: 30,
  ADDRESS_LINE3: 10,
  CITY: 60,
  ADDRESS_COUNTRY: 2,
  ZIP_CODE5: 5,
  POSTAL_CODE: 16,
  // Supplemental Claim - 995
  SC_CLAIMANT_OTHER: 25, // does this still exist?
  SC_EVIDENCE_LOCATION_AND_NAME: 255,
  // Higher Lever Review - 996
  DISAGREEMENT_REASON: 90,
  HLR_REP_FIRST_NAME: 30,
  HLR_REP_LAST_NAME: 40,
  // Notice of Disagreement - 10182
  NOD_ISSUE_NAME: 180,
  NOD_EXTENSION_REASON: 2300, // in v2 schema
};

/**
 **** REGULAR EXPRESSIONS ****
 */
export const REGEXP = {
  APOSTROPHE: /\u2019/g,
  COMMA: /[, ]/g,
  DASH: /-/g,
  EMPTY_DATE: /^(-|--|-00-00)$/,
  NON_DIGIT: /\D/g,
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
  otherEntry: 'Something else',
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

export const NONE_SELECTED_ERROR =
  'You must select at least 1 issue before you can continue filling out your request.';

export const MAX_SELECTED_ERROR =
  'You’ve reached the maximum number of allowed selected issues';

export const NOT_ANSWERED = 'Not answered';
