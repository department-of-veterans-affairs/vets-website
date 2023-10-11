import React from 'react';

import { MAX_LENGTH } from '../../shared/constants';

const hintText =
  'You can only add an issue that you’ve received a VA decision notice for.';

export const issueErrorMessages = {
  missingIssue: 'You must add an issue',
  uniqueIssue: 'You must enter an issue you haven’t already entered',
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

export const content = {
  title: {
    add: 'Add an issue',
    edit: 'Edit an issue',
  },

  button: {
    cancel: 'Cancel',
    add: 'Add issue',
    edit: 'Update issue',
  },
  name: {
    label: 'Name of issue',
    hintText,
    hint: (
      <p className="vads-u-font-weight--normal label-description">{hintText}</p>
    ),
  },
  date: {
    label: 'Date of decision',
    hint:
      'You can find the decision date on your decision notice (the letter you received physically in the mail from us).',
  },
};

export const missingIssuesErrorMessageText =
  'Add, and select, at least one issue, so we can process your request';

export const missingIssuesErrorMessage = (
  <span className="usa-input-error-message" role="alert">
    <span className="sr-only">Error</span>
    {missingIssuesErrorMessageText}
  </span>
);
