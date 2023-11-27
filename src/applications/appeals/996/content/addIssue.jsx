import React from 'react';

import { MAX_LENGTH } from '../../shared/constants';

const hintText =
  'You can only add an issue that you’ve received a VA decision notice for.';

export const issueErrorMessages = {
  missingIssue: 'Please add the name of an issue',
  maxLength: `Please enter less than ${
    MAX_LENGTH.ISSUE_NAME
  } characters for this issue name`,

  invalidDate: 'Please provide a valid date',
  blankDecisionDate: 'Please enter a decision date',
  invalidDateRange: (min, max) =>
    `Please enter a year between ${min} and ${max}`,
  pastDate: 'Please add a past decision date',
  newerDate: 'Please add an issue with a decision date less than a year old',
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
      'Enter the date on your decision notice (the letter you received in the mail from us).',
  },
};
