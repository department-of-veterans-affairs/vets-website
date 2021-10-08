import { benefitTypes } from 'vets-json-schema/dist/constants.json';
import environment from 'platform/utilities/environment';

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
export const LEGACY_APPEALS_URL = '/decision-reviews/legacy-appeals/';

// 8622 is the ID of the <li> wrapping the "Find addresses for other benefit
// types" accordion
export const BENEFIT_OFFICES_URL = `${HLR_INFO_URL}#find-addresses`;

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

export const MAX_SELECTIONS = 100;

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

export const SUPPORTED_BENEFIT_TYPES = benefitTypes.map(type => ({
  ...type,
  isSupported: supportedBenefitTypes.includes(type.value),
}));

export const IS_PRODUCTION = environment.isProduction();

export const CONFERENCE_TIMES_V1 = {
  time0800to1000: {
    label: '8:00 a.m. to 10:00 a.m. ET',
    submit: '800-1000 ET',
  },
  time1000to1230: {
    label: '10:00 a.m. to 12:30 p.m. ET',
    submit: '1000-1230 ET',
  },
  time1230to1400: {
    label: '12:30 p.m. to 2:00 p.m. ET',
    submit: '1230-1400 ET',
  },
  time1400to1630: {
    label: '2:00 p.m. to 4:30 p.m. ET',
    submit: '1400-1630 ET',
  },
};

export const CONFERENCE_TIMES_V2 = {
  time0800to1200: {
    label: '8:00 a.m. to 12:00 p.m. ET',
    submit: '800-1200 ET',
  },
  time1200to1630: {
    label: '12:00 p.m. to 4:30 p.m. ET',
    submit: '1200-1630 ET',
  },
};
