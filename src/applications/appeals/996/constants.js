import constants from 'vets-json-schema/dist/constants.json';
// import schema from 'vets-json-schema/dist/20-0996-schema.json';

// *** URLS ***
export const HLR_INFO_URL = '/decision-reviews/higher-level-review/';
// Same as "rootUrl" in manifest.json
export const BASE_URL = `${HLR_INFO_URL}request-higher-level-review-form-20-0996`;

export const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf';

export const BOARD_APPEALS_URL = '/decision-reviews/board-appeal/';
export const DECISION_REVIEWS_URL = '/decision-reviews/';
export const CLAIM_STATUS_TOOL_URL = '/claim-or-appeal-status/';
export const SUPPLEMENTAL_CLAIM_URL = '/decision-reviews/supplemental-claim/';
export const COVID_FAQ_URL =
  'https://www.va.gov/coronavirus-veteran-frequently-asked-questions/#more-benefit-and-claim-questio';
export const FACILITY_LOCATOR_URL = '/find-locations';
export const GET_HELP_REVIEW_REQUEST_URL =
  '/decision-reviews/get-help-with-review-request';
export const PROFILE_URL = '/profile';

// 8622 is the ID of the <va-accordion-item> with a header of the "Find
// addresses for other benefit types"
export const BENEFIT_OFFICES_URL = `${HLR_INFO_URL}#find-addresses-for-other-benef-8622`;

export const CONTESTABLE_ISSUES_API =
  '/higher_level_reviews/contestable_issues/';

// key for contestedIssues to indicate that the user selected the issue
export const SELECTED = 'view:selected';

// Including a default until we determine how to get around the user restarting
// the application after using the "Finish this application later" link
// See https://dsva.slack.com/archives/C0113MPTGH5/p1600725048027200
export const DEFAULT_BENEFIT_TYPE = 'compensation';

export const errorMessages = {
  savedFormNotFound: 'Please start over to request a Higher-Level Review',
  savedFormNoAuth:
    'Please sign in again to continue your request for Higher-Level Review',
  forwardStartDate: 'Please select a date',
  startDateInPast: 'Start date must be in the future',
  endDateInPast: 'End date must be in the future',
  endDateBeforeStart: 'End date must be after start date',
  informalConferenceContactChoice: 'Please choose an option',
  informalConferenceContactName: 'Please enter your representative’s name',
  informalConferenceContactFirstName:
    'Please enter your representative’s first name',
  informalConferenceContactLastName:
    'Please enter your representative’s last name',
  informalConferenceContactPhone:
    'Please enter your representative’s phone number',
  informalConferenceContactPhonePattern:
    'Please enter a 10-digit phone number (with or without dashes)',
  informalConferenceTimes: 'Please select a time',
  contestedIssue: 'Please select an eligible issue',
};

export const NULL_CONDITION_STRING = 'Unknown Condition';

// contested issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';
export const FORMAT_READABLE = 'LL';

// session storage keys
export const SAVED_CLAIM_TYPE = 'hlrClaimType';
export const WIZARD_STATUS = 'wizardStatus996';
export const LAST_HLR_ITEM = 'lastHlrItem'; // focus management across pages

// Values from benefitTypes in vets-json-schema constants
const supportedBenefitTypes = [
  'compensation', // Phase 1
  // 'pension',
  // 'fiduciary',
  // 'education',
  // 'vha',
  // 'voc_rehab',
  // 'loan_guaranty',
  // 'insurance',
  // 'nca',
];

export const LEGACY_TYPE = 'legacyAppeal';

export const SUPPORTED_BENEFIT_TYPES = constants.benefitTypes.map(type => ({
  ...type,
  isSupported: supportedBenefitTypes.includes(type.value),
}));

export const CONFERENCE_TIMES_V2 = {
  time0800to1200: {
    label: '8:00 a.m. to noon ET',
    submit: '800-1200 ET',
  },
  time1200to1630: {
    label: 'Noon to 4:30 p.m. ET',
    submit: '1200-1630 ET',
  },
};

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

// Using MAX_LENGTH.DISAGREEMENT_REASON (90) and with all checkboxes selected,
// this string is submitted - the numbers constitute the "something else" typed
// in value
// "service connection,effective date,disability evaluation,1234567890123456789012345678901234"
export const SUBMITTED_DISAGREEMENTS = {
  serviceConnection: 'service connection',
  effectiveDate: 'effective date',
  evaluation: 'disability evaluation',
};

export const contestableIssuesPath = 'contestable-issues'; // v2
