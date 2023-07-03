import React from 'react';

import { MAX_LENGTH } from '../constants';

export const issueErrorMessages = {
  missingIssue: 'Add the name of an issue',
  uniqueIssue: 'Enter a unique condition name',
  maxLength: `Enter less than ${
    MAX_LENGTH.ISSUE_NAME
  } characters for this issue name`,

  invalidDate: 'Provide a valid date',
  missingDecisionDate: 'Enter a decision date',
  invalidDateRange: (min, max) => `Enter a year between ${min} and ${max}`,
  pastDate: 'Add a past decision date',
  newerDate: 'Add an issue with a decision date less than a year old',
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
    hint: (
      <p className="vads-u-font-weight--normal label-description">
        You can only add an issue that you’ve already received a VA decision
        notice for.
      </p>
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
