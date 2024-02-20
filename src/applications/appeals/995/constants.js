import constants from 'vets-json-schema/dist/constants.json';
// import schema from './config/form-0995-schema.json';
import { MAX_LENGTH } from '../shared/constants';

export const APP_NAME = 'Supplemental Claim';

export const DATA_DOG_ID = '2779ccc3-be87-4b2d-a757-9ff54b58761b';
export const DATA_DOG_TOKEN = 'pub442ae6e93be9f8d93a358bf78095c88a';
export const DATA_DOG_SERVICE = 'benefits---supplemental-claim';

// *** URLS ***
export const DECISION_REVIEWS_URL = '/decision-reviews';
export const SC_INFO_URL = `${DECISION_REVIEWS_URL}/supplemental-claim`;
// Same as "rootUrl" in manifest.json
export const BASE_URL = `${SC_INFO_URL}/file-supplemental-claim-form-20-0995`;

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
  '/supplemental_claims/contestable_issues/';

export const ITF_API = '/intent_to_file';

// Evidence upload API - same endpoint as NOD
export const EVIDENCE_UPLOAD_API = '/v0/decision_review_evidence';

export const SUBMIT_URL = '/v1/supplemental_claims';

export const PRIMARY_PHONE = 'view:primaryPhone';
export const PRIMARY_PHONE_TYPES = ['home', 'mobile'];

export const EVIDENCE_VA = 'view:hasVaEvidence';
export const EVIDENCE_PRIVATE = 'view:hasPrivateEvidence';
export const EVIDENCE_OTHER = 'view:hasOtherEvidence';

// Including a default until we determine how to get around the user restarting
// the application after using the "Finish this application later" link
// See https://dsva.slack.com/archives/C0113MPTGH5/p1600725048027200
export const DEFAULT_BENEFIT_TYPE = 'compensation';

export const REGEX_COMMA = /[, ]/g;
export const REGEX_EMPTY_DATE = /(--|-00-00)/;

export const errorMessages = {
  contestedIssue: 'You must select an eligible issue',
  missingIssue: 'You must add an issue',
  maxLength: `You can enter a maximum of ${MAX_LENGTH.ISSUE_NAME} characters`,
  requiredYesNo: 'You must answer yes or no',

  invalidDate: 'You must provide a date that includes a month, day, and year',
  // startDateInPast: 'The start date must be in the future',
  // endDateInPast: 'The end date must be in the future',
  endDateBeforeStart: 'The end date must be after the start date',
  cardInvalidDate: 'Invalid decision date',

  decisions: {
    blankDate: 'You must enter a decision date',
    pastDate: 'You must add a decision date that’s in the past',
    newerDate:
      'You must add an issue with a decision date that’s less than 100 years old',
  },
  evidence: {
    // VA evidence
    pastDate: 'You must add a past treatment date',
    newerDate: 'You must add a more recent treatment date',
    blankDate: 'You must enter a treatment date',
    missing: 'You must include at least 1 type of supporting evidence',
    locationMissing: 'You must enter a treatment location',
    locationMaxLength: 'You can enter a maximum of 255 characters',
    issuesMissing: 'You must select 1 or more conditions',
    uniqueVA:
      'You must enter a location, condition and dates you haven’t already entered',

    // private evidence
    facilityMissing: 'You must add a provider or facility name',
    country: 'You must choose a country',
    street: 'You must enter a street address',
    city: 'You must enter a city name',
    state: 'You must choose a state',
    postal: 'You must enter a postal code',
    uniquePrivate:
      'You must enter a provider, address, condition and dates you haven’t already entered',

    upload: 'You must provide a password to decrypt this file',
  },

  missingPrimaryPhone: 'You must choose a primary phone number',
  invalidZip:
    'You must enter a valid 5- or 9-digit postal code (dashes allowed)',
};

export const NULL_CONDITION_STRING = 'Unknown Condition';
export const NO_ISSUES_SELECTED = 'No issues were selected';

// contested issue dates
export const SUMMARY_EDIT = 'edit-evidence-summary'; // evidence summary focus
export const REVIEW_CONTACT = 'onReviewPageContact';
export const LIMITATION_KEY = 'limitation';

// Values from benefitTypes in Lighthouse 0995 schema
// schema.definitions.scCreate.properties.data.properties.attributes.properties.benefitType.emum;
export const SUPPORTED_BENEFIT_TYPES_LIST = [
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

export const AMA_DATE = '2019-02-19'; // Appeals Modernization Act in effect

export const SUPPORTED_BENEFIT_TYPES = constants.benefitTypes.map(type => ({
  ...type,
  isSupported: SUPPORTED_BENEFIT_TYPES_LIST.includes(type.value),
}));

// Once we include the 'pensionSurvivorsBenefits' type, we will need to know
// from VBA is the ITF pension also includes survivors benefits. If not, then
// the start page (subtask) benefit type question will need to split "pension"
// and "survivors benefits"
export const ITF_SUPPORTED_BENEFIT_TYPES = [
  'compensation', // Phase 1
  'pensionSurvivorsBenefits', // see comment above
];

// Copied from schmea
// schema.definitions.scCreate.properties.data.properties.attributes.properties.claimantType.enum;
export const CLAIMANT_TYPES = [
  'veteran', // Phase 1
  // 'spouse_of_veteran',
  // 'child_of_veteran',
  // 'parent_of_veteran',
  // 'other',
];

export const ITF_STATUSES = {
  active: 'active',
  expired: 'expired',
  claimRecieved: 'claim_recieved',
  duplicate: 'duplicate',
  incomplete: 'incomplete',
  canceled: 'canceled',
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

export const CONTACT_INFO_PATH = 'contact-information';
export const ADD_ISSUE_PATH = 'add-issue';
export const EVIDENCE_VA_REQUEST =
  'supporting-evidence/request-va-medical-records';
export const EVIDENCE_VA_PATH = 'supporting-evidence/va-medical-records';
export const EVIDENCE_PRIVATE_REQUEST =
  'supporting-evidence/request-private-medical-records';
export const EVIDENCE_PRIVATE_PATH =
  'supporting-evidence/private-medical-records';
export const EVIDENCE_LIMITATION_PATH =
  'supporting-evidence/add-private-record-limitations';

// TODO: Update this path
export const EVIDENCE_ADDITIONAL_PATH =
  'supporting-evidence/will-add-supporting-evidence';
export const EVIDENCE_UPLOAD_PATH = 'supporting-evidence/upload-evidence';
