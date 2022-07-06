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
