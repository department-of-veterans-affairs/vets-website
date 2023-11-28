import React from 'react';

import { MAX_LENGTH } from '../../shared/constants';

export const issueErrorMessages = {
  missingIssue: 'You must add an issue',
  maxLength: `You can enter a maximum of ${
    MAX_LENGTH.NOD_ISSUE_NAME
  } characters`,

  invalidDate: 'You must provide a date that includes a month, day, and year',
  blankDecisionDate: 'You must enter a decision date',
  invalidDateRange: (min, max) =>
    `You must enter a year between ${min} and ${max}`,
  pastDate: 'You must add a decision date that’s in the past',
  recentDate:
    'You must add an issue with a decision date that’s less than a year old',
  newerDate:
    'You must add an issue with a decision date that’s less than 100 years old',
};

export const missingIssuesErrorMessageText =
  'Add, and select, at least one issue, so we can process your request';

export const missingIssuesErrorMessage = (
  <span className="usa-input-error-message" role="alert">
    <span className="sr-only">Error</span>
    {missingIssuesErrorMessageText}
  </span>
);
