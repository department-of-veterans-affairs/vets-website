import constants from 'vets-json-schema/dist/constants.json';
import manifest from '../manifest.json';
// import schema from './config/form-0995-schema.json';

export const APP_NAME = 'Supplemental Claim';
export const FORM_ID = 'VA Form 20-0995';
export const FORM_IDS_4142 = 'VA Forms 21-4142 and 21-4142a';
export const APP_SUBHEADER = `${FORM_IDS_4142} with ${FORM_ID}`;

export const DATA_DOG_ID = '2779ccc3-be87-4b2d-a757-9ff54b58761b';
export const DATA_DOG_TOKEN = 'pub442ae6e93be9f8d93a358bf78095c88a';
export const DATA_DOG_SERVICE = 'benefits---supplemental-claim';

export const NOV_2025_REDESIGN_TOGGLE = 'decision_review_sc_redesign_nov2025';
export const TOGGLE_KEY = 'decisionReviewsScRedesign';

// *** URLS ***
export const DECISION_REVIEWS_URL = '/decision-reviews';
export const SC_INFO_URL = `${DECISION_REVIEWS_URL}/supplemental-claim`;
export const BASE_URL = manifest.rootUrl;
export const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-20-0995-ARE.pdf';
export const CONTACT_INFO_URL = 'contact-information';
export const ADD_ISSUE_URL = 'add-issue';
export const EVIDENCE_VA_PROMPT_URL =
  'supporting-evidence/request-va-medical-records';
export const EVIDENCE_VA_DETAILS_URL =
  'supporting-evidence/va-medical-records-v0';
export const EVIDENCE_PRIVATE_PROMPT_URL =
  'supporting-evidence/private-medical-records';
export const EVIDENCE_PRIVATE_AUTHORIZATION_URL =
  'supporting-evidence/private-medical-records-authorization';
// export const EVIDENCE_PRIVATE_DETAILS_URL =
//   'supporting-evidence/private-medical-records';
export const EVIDENCE_PRIVATE_DETAILS_URL =
  'supporting-evidence/private-medical-records-v0';
export const LIMITED_CONSENT_PROMPT_URL = 'supporting-evidence/add-limitation';
export const LIMITED_CONSENT_DETAILS_URL = 'supporting-evidence/limitation';
export const EVIDENCE_ADDITIONAL_URL =
  'supporting-evidence/will-add-supporting-evidence';
export const EVIDENCE_UPLOAD_URL = 'supporting-evidence/upload-evidence';

// This is for URLs specific to the redesign to avoid collision with existing URL variables
export const EVIDENCE_URLS = {
  vaLocation: 'supporting-evidence/:index/va-medical-records-location',
  vaIssues: 'supporting-evidence/:index/va-medical-records-condition',
  vaTreatmentDatePrompt: 'supporting-evidence/:index/va-medical-before-2005',
  vaTreatmentDateDetails:
    'supporting-evidence/:index/va-medical-before-2005-date',
  vaPromptSummary: 'supporting-evidence/va-medical-records',
  privateDetails: 'supporting-evidence/:index/private-medical-records-location',
  privateIntro: 'supporting-evidence/private-medical-records-intro',
  privateIssues: 'supporting-evidence/:index/private-medical-records-condition',
  privateSummary: 'supporting-evidence/private-medical-records-summary',
  privateTreatmentDate:
    'supporting-evidence/:index/private-medical-records-dates',
  uploadPrompt: 'supporting-evidence/add-supporting-evidence',
};

// Point to header of the "File by mail, in person, or with the help of a VSO
// for any type of benefit claim"
export const BENEFIT_OFFICES_URL = `${SC_INFO_URL}#file-by-mail-in-person-or-with`;

export const PRIMARY_PHONE = 'view:primaryPhone';
export const PRIMARY_PHONE_TYPES = ['home', 'mobile'];

export const OTHER_HOUSING_RISK_MAX = 100;
export const POINT_OF_CONTACT_MAX = 150;
export const TREATMENT_FACILITY_OTHER_MAX = 115;

// Form Keys
export const HAS_VA_EVIDENCE = 'view:hasVaEvidence';
export const HAS_PRIVATE_EVIDENCE = 'view:hasPrivateEvidence';
export const HAS_OTHER_EVIDENCE = 'view:hasOtherEvidence';
export const HAS_PRIVATE_LIMITATION = 'view:hasPrivateLimitation';
export const MST_OPTION = 'mstOption';
export const VA_EVIDENCE_PROMPT_KEY = 'hasVaEvidence';
export const VA_EVIDENCE_KEY = 'vaEvidence';
export const PRIVATE_EVIDENCE_PROMPT_KEY = 'hasPrivateEvidence';
export const PRIVATE_EVIDENCE_KEY = 'privateEvidence';
export const VA_TREATMENT_LOCATION_KEY = 'vaTreatmentLocation';
export const PRIVATE_TREATMENT_LOCATION_KEY = 'privateTreatmentLocation';
export const VA_TREATMENT_BEFORE_2005_KEY = 'treatmentBefore2005';
export const VA_TREATMENT_MONTH_YEAR_KEY = 'treatmentMonthYear';

export const errorMessages = {
  evidence: {
    // VA evidence
    pastDate: 'You must add a past treatment date',
    newerDate: 'You must add a more recent treatment date',
    blankDate: 'Enter a month from 1 to 12, even if it’s an estimate',
    missing: 'You must include at least 1 type of supporting evidence',
    locationMissing: 'Enter a treatment location',
    locationMaxLength: 'You can enter a maximum of 255 characters',
    issuesMissing: 'Select a condition',
    uniqueVA:
      'You must enter a location, condition and dates you haven’t already entered',

    // private evidence
    facilityMissing: 'Enter a location name',
    uniquePrivate:
      'You must enter a provider, address, condition and dates you haven’t already entered',
  },

  missingPrimaryPhone: 'You must choose a primary phone number',
  missingPrimaryPhoneReview: 'Missing primary phone',
};

export const NO_ISSUES_SELECTED = 'No issues were selected';

// contested issue dates
export const SUMMARY_EDIT = 'edit-evidence-summary'; // evidence summary focus
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
  claimRecieved: 'claim_recieved', // intentional typo to match API
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
  L228:
    'VA Form 21-0781 - Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)',
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

export const AUTHORIZATION_LABEL =
  'I acknowledge and authorize this release of information';
