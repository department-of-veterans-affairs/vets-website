import React from 'react';

import { MAX_ISSUE_NAME_LENGTH } from '../constants';

export const issueErrorMessages = {
  missingIssue: 'Please add the name of an issue',
  uniqueIssue: 'Please enter a unique condition name',
  maxLength: `Please enter less than ${MAX_ISSUE_NAME_LENGTH} characters for this issue name`,

  invalidDate: 'Please provide a valid date',
  missingDecisionDate: 'Please enter a decision date',
  invalidDateRange: (min, max) =>
    `Please enter a year between ${min} and ${max}`,
  pastDate: 'Please add a past decision date',
  newerDate: 'Please add an issue with a decision date less than a year old',
};

export const addIssueTitle = 'Add an issue and our decision date on this issue';

export const issueNameLabel = (
  <>
    <strong>Name of issue</strong>
    <span className="form-required-span">(*Required)</span>
    <p className="vads-u-font-weight--normal label-description">
      You can only add an issue that you’ve already received a VA decision
      notice for.
    </p>
  </>
);

export const dateOfDecisionLabel = (
  <>
    <strong>Date of decision</strong>
    <span className="form-required-span">(*Required)</span>
    <p className="vads-u-font-weight--normal label-description">
      You can find the decision date on your decision notice (the letter you got
      in the mail from us).
    </p>
  </>
);
