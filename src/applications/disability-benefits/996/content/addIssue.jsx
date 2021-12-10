import React from 'react';

import { MAX_ISSUE_NAME_LENGTH } from '../constants';

export const missingIssueErrorMessage = 'Please add the name of an issue';
export const uniqueIssueErrorMessage = 'Please enter a unique condition name';

export const issueNameLabel = 'Name of issue';
export const dateOfDecisionLabel = 'Date of decision';

export const addIssueLabel = (
  <>
    <span className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans">
      Add an issue and our decision date on this issue. You can find the
      decision date on your decision notice (the letter you got in the mail from
      us).
    </span>
    <p className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans">
      <strong>Note:</strong> You can only add an issue that you’ve already
      received a VA decision notice for.
    </p>
  </>
);

export const maxLengthErrorMessage = `Please enter less than ${MAX_ISSUE_NAME_LENGTH} characters for this issue name`;
