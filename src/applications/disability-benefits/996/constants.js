import { benefitTypes } from 'vets-json-schema/dist/constants.json';

// *** URLS ***
// Same as "rootUrl" in manifest.json
export const BASE_URL =
  '/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996';
export const GET_CONTESTABLE_ISSUES =
  '/higher_level_reviews/contestable_issues/';
export const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf';
export const COVID_FAQ_URL =
  'https://www.va.gov/coronavirus-veteran-frequently-asked-questions/#more-benefit-and-claim-questio';
export const SUPPLEMENTAL_CLAIM_URL = '/decision-reviews/supplemental-claim/';
// 8622 is the ID of the <li> wrapping the "Find addresses for other benefit
// types" accordion
export const BENEFIT_OFFICES_URL =
  '/decision-reviews/higher-level-review/#8622';

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
  informalConferenceContactName: 'Please enter a name',
  informalConferenceContactPhone: 'Please enter a number',
  informalConferenceTimesMin: 'You can choose up to two time periods',
  informalConferenceTimesMax: 'You can choose up to two time periods',
  contestedIssue: 'Please select a contested issue',
  contestedIssueCommentLength:
    'Please enter no more than 400 characters in this field',
};

export const patternMessages = {
  representativePhone:
    'Please enter a 10-digit phone number (with or without dashes)',
};

export const NULL_CONDITION_STRING = 'Unknown Condition';

export const SAVED_CLAIM_TYPE = 'hlrClaimType';

// Values from benefitTypes in vets-json-schema constants
const supportedBenefitTypes = [
  'compensation', // MVP
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
