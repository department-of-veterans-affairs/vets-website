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

export const DECISION_REVIEWS_URL = '/decision-reviews/';
export const SUPPLEMENTAL_CLAIM_URL = '/decision-reviews/supplemental-claim/';
export const GET_HELP_REP_OR_VSO_URL =
  '/get-help-from-accredited-representative';
export const HEALTH_BENEFITS_URL = '/health-care/about-va-health-benefits';
export const MST_INFO =
  '/health-care/health-needs-conditions/military-sexual-trauma/';
export const PROFILE_URL = '/profile';

// Header of the "Submit your request by mail for any type of benefit claim"
// anchor (not an accordion)
export const BENEFIT_OFFICES_URL = `${HLR_INFO_URL}#file-by-mail-in-person-or-with`;

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

// Conference time label values; changed v2 to v2_5, because lighthouse updated
// the v2 endpoint without incrementing the version
export const CONFERENCE_TIMES_V2_5 = {
  time0800to1200: {
    // v2 label
    label: '8:00 a.m. to noon ET',
    // v2.5 labels
    labelMe: 'Morning hours in my time zone',
    labelRep: 'Morning hours in your accredited representative’s time zone',
    submit: '800-1200 ET', // v2 & v2.5 use the same submit value
  },
  time1200to1630: {
    // v2 label
    label: 'Noon to 4:30 p.m. ET',
    // v2.5 labels
    labelMe: 'Afternoon hours in my time zone',
    labelRep: 'Afternoon hours in your accredited representative’s time zone',
    submit: '1200-1630 ET', // v2 & v2.5 use the same submit value
  },
};

export const CONTACT_INFO_PATH = 'contact-information';
export const ADD_ISSUE_PATH = 'add-issue';
