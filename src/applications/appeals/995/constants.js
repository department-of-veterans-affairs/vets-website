import constants from 'vets-json-schema/dist/constants.json';
// import schema from './config/form-0995-schema.json';

// *** URLS ***
export const DECISION_REVIEWS_URL = '/decision-reviews';
export const SC_INFO_URL = `${DECISION_REVIEWS_URL}/supplemental-claim`;
// Same as "rootUrl" in manifest.json
export const BASE_URL = `${SC_INFO_URL}/request-supplemental-claim-form-20-0995`;

export const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf';

export const BOARD_APPEALS_URL = `${DECISION_REVIEWS_URL}/board-appeal`;
export const CLAIM_STATUS_TOOL_URL = '/claim-or-appeal-status';
export const HIGHER_LEVEL_REVIEW_URL = `${DECISION_REVIEWS_URL}/higher-level-review`;
export const COVID_FAQ_URL =
  'https://www.va.gov/coronavirus-veteran-frequently-asked-questions/#more-benefit-and-claim-questio';
export const FACILITY_LOCATOR_URL = '/find-locations';
export const GET_HELP_REVIEW_REQUEST_URL = `${DECISION_REVIEWS_URL}/get-help-with-review-request`;
export const PROFILE_URL = '/profile';

// 8804 is the ID of the <va-accordion-item> with a header of the "Find
// addresses for other benefit types"
export const BENEFIT_OFFICES_URL = `${SC_INFO_URL}#find-addresses-for-other-benef-8804`;

// TODO: Update to common contestable issues endpoint, once it is set up
// not shown are the `v0` prefix and `{benefit_type}` suffix
export const CONTESTABLE_ISSUES_API =
  '/higher_level_reviews/contestable_issues/';

// key for contestedIssues to indicate that the user selected the issue
export const SELECTED = 'view:selected';

// Including a default until we determine how to get around the user restarting
// the application after using the "Finish this application later" link
// See https://dsva.slack.com/archives/C0113MPTGH5/p1600725048027200
export const DEFAULT_BENEFIT_TYPE = 'compensation';

export const errorMessages = {
  savedFormNotFound: 'Please start over to request a Supplemental Claim',
  savedFormNoAuth:
    'Please sign in again to continue your request a Supplemental Claim',
  invalidDate: 'Please choose a date',
  startDateInPast: 'Start date must be in the future',
  endDateInPast: 'End date must be in the future',
  endDateBeforeStart: 'End date must be after start date',
  contestedIssue: 'Please select an eligible issue',

  evidenceTypeMissing: 'Please select at least one type of supporting evidence',
  locationAndNameMissing: 'Please add a treatment location',
};

export const NULL_CONDITION_STRING = 'Unknown Condition';

// contested issue dates
export const FORMAT_YMD = 'YYYY-MM-DD';
export const FORMAT_READABLE = 'LL';

export const LAST_SC_ITEM = 'lastScItem'; // focus management across pages

// Values from benefitTypes in Lighthouse 0995 schema
// schema.definitions.scCreate.properties.data.properties.attributes.properties.benefitType.emum;
const supportedBenefitTypes = [
  'compensation', // Phase 1
  // 'pensionSurvivorsBenefits',
  // 'fiduciary',
  // 'lifeInsurance',
  // 'veteransHealthAdministration',
  // 'veteranReadinessAndEmployment',
  // 'loanGuaranty',
  // 'education',
  // 'nationalCemeteryAdministration',
];

export const LEGACY_TYPE = 'legacyAppeal';

export const SUPPORTED_BENEFIT_TYPES = constants.benefitTypes.map(type => ({
  ...type,
  isSupported: supportedBenefitTypes.includes(type.value),
}));

// Copied from schmea
// schema.definitions.scCreate.properties.data.properties.attributes.properties.claimantType.enum;
export const CLAIMANT_TYPES = [
  'spouse_of_veteran',
  'child_of_veteran',
  'parent_of_veteran',
  'other',
];

export const SUPPORTED_UPLOAD_TYPES = ['pdf'];

export const MAX_FILE_SIZE_MB = 100;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 ** 2; // binary based

export const ATTACHMENTS_PRIVATE = {
  L049: 'Medical Treatment Record - Non-Government Facility',
  L107: 'VA 21-4142 Authorization for Release of Information',
  L023: 'Other',
};

export const ATTACHMENTS_OTHER = {
  L015: 'Buddy/Lay Statement',
  L018: 'Civilian Police Reports',
  L029: 'Copy of a DD214',
  L702: 'Disability Benefits Questionnaire (DBQ)',
  L703: 'Goldmann Perimetry Chart/Field Of Vision Chart',
  L034: 'Military Personnel Record',
  L478: 'Medical Treatment Records - Furnished by SSA',
  L048: 'Medical Treatment Record - Government Facility',
  L049: 'Medical Treatment Record - Non-Government Facility',
  L023: 'Other Correspondence',
  L070: 'Photographs',
  L222:
    'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
  L228: 'VA Form 21-0781 - Statement in Support of Claim for PTSD',
  L229:
    'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  L102:
    'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
  L107: 'VA Form 21-4142 - Authorization To Disclose Information',
  L827: 'VA Form 21-4142a - General Release for Medical Provider Information',
  L115:
    'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  L117:
    'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
  L159:
    'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
  L133: 'VA Form 21-674 - Request for Approval of School Attendance',
  L139: 'VA Form 21-686c - Declaration of Status of Dependents',
  L149:
    'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
};

// Values from Lighthouse maintained schema
// see ./config/form-0995-schema.json
export const MAX_LENGTH = {
  SELECTIONS: 100, // submitted issues
  EVIDENCE_DATES: 4, // items
  ISSUE_NAME: 140,
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
  CLAIMANT_OTHER: 25,
  EVIDENCE_LOCATION_AND_NAME: 255,
};

export const CONTESTABLE_ISSUES_PATH = 'contestable-issues';
