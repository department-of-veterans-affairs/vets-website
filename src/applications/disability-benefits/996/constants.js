// Same as "rootUrl" in manifest.json
export const BASE_URL =
  '/decision-reviews/higher-level-review/request-higher-level-review-form-20-0996';

export const FORM_URL = 'https://www.vba.va.gov/pubs/forms/VBA-20-0996-ARE.pdf';

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
