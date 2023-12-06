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
export const PROFILE_URL = '/profile';

// 8622 is the ID of the <va-accordion-item> with a header of the "Find
// addresses for other benefit types"
export const BENEFIT_OFFICES_URL = `${HLR_INFO_URL}#find-addresses-for-other-benef-8622`;

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

// session storage keys
export const SAVED_CLAIM_TYPE = 'hlrClaimType';
export const WIZARD_STATUS = 'wizardStatus996';

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

export const CONTACT_INFO_PATH = 'contact-information';
export const ADD_ISSUE_PATH = 'add-issue';
