import React from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

import { MAX_SELECTIONS, MAX_ISSUE_NAME_LENGTH } from '../constants';

export const missingIssueErrorMessage = 'Please add the name of an issue';
export const noneSelected = 'Please add and select at least one issue';
export const uniqueIssueErrorMessage = 'Please enter a unique condition name';

export const maxSelectedErrorMessage =
  'You’ve reached the maximum number of allowed selected issues';

export const maxLengthErrorMessage = `Please enter less than ${MAX_ISSUE_NAME_LENGTH} characters for this issue name`;

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal }) => (
  <Modal
    title={maxSelectedErrorMessage}
    status="warning"
    onClose={closeModal}
    visible
  >
    You are limited to {MAX_SELECTIONS} selected issues for each Higher-Level
    Review request. If you would like to select more than {MAX_SELECTIONS},
    please submit this request and create a new request for the remaining
    issues.
  </Modal>
);

export const missingIssuesErrorMessageText =
  'Please select an eligible issue, or add and select an issue';
export const missingIssuesErrorMessage = (
  <span className="usa-input-error-message" role="alert">
    <span className="sr-only">Error</span>
    {missingIssuesErrorMessageText}
  </span>
);

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

export const NoneSelectedAlert = (
  <va-alert status="error" className="vads-u-margin-top--2">
    Please select an eligible issue, or add and select an issue
  </va-alert>
);
