import constants from 'vets-json-schema/dist/constants.json';
// import schema from 'vets-json-schema/dist/20-0996-schema.json';

export const APP_NAME = 'Higher-Level Review';

export const DATA_DOG_ID = '321995f8-5fed-4b4f-907b-e3f5ec34c28f';
export const DATA_DOG_TOKEN = 'pub780eb728ff6dc0306d17cbb08743f86b';
export const DATA_DOG_SERVICE = 'benefits---higher-level-review';

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
export const GET_HELP_REP_OR_VSO_URL =
  '/get-help-from-accredited-representative';
export const HEALTH_BENEFITS_URL = '/health-care/about-va-health-benefits';
export const MST_COORD_URL =
  'https://www.mentalhealth.va.gov/msthome/vha-mst-coordinators.asp';
export const PROFILE_URL = '/profile';

// Header of the "Submit your request by mail for any type of benefit claim"
// anchor (not an accordion)
export const BENEFIT_OFFICES_URL = `${HLR_INFO_URL}#file-by-mail-in-person-or-with`;

export const CONTESTABLE_ISSUES_API =
  '/higher_level_reviews/contestable_issues/';

// Including a default until we determine how to get around the user restarting
// the application after using the "Finish this application later" link
// See https://dsva.slack.com/archives/C0113MPTGH5/p1600725048027200
export const DEFAULT_BENEFIT_TYPE = 'compensation';

export const errorMessages = {
  savedFormNotFound: 'Please start over to request a Higher-Level Review',
  savedFormNoAuth:
    'Please sign in again to continue your request for Higher-Level Review',

  informalConferenceContactChoice: 'You must choose an option',
  informalConferenceContactName: 'You must enter your representative’s name',
  informalConferenceContactFirstName:
    'You must enter your representative’s first name',
  informalConferenceContactLastName:
    'You must enter your representative’s last name',
  informalConferenceContactPhone:
    'You must enter your representative’s phone number',
  informalConferenceContactPhonePattern:
    'You must enter a 10-digit phone number',
  informalConferenceTimes: 'You must select a time',
};

export const NULL_CONDITION_STRING = 'Unknown Condition';

// Values from benefitTypes in vets-json-schema constants
export const SUPPORTED_BENEFIT_TYPES_LIST = [
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

export const SUPPORTED_BENEFIT_TYPES = constants.benefitTypes.map(type => ({
  ...type,
  isSupported: SUPPORTED_BENEFIT_TYPES_LIST.includes(type.value),
}));

// Update submit values once Lighthouse's v3 endpoint is ready & we've switched
export const CONFERENCE_TIMES_V3 = {
  time0800to1200: {
    labelMe: 'Morning hours in my time zone',
    labelRep: 'Morning hours in your accredited representative’s time zone',
    submit: '800-1200 ET',
  },
  time1200to1630: {
    labelMe: 'Afternoon hours in my time zone',
    labelRep: 'Afternoon hours in your accredited representative’s time zone',
    submit: '1200-1630 ET',
  },
};

export const CONTACT_INFO_PATH = 'contact-information';
export const ADD_ISSUE_PATH = 'add-issue';
