import React from 'react';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

export const missingIssueErrorMessage = 'Please add the name of an issue';
export const noneSelected = 'Please add and select at least one issue';
export const uniqueIssueErrorMessage = 'Please enter a unique condition name';

export const maxSelected =
  'You’ve reached the maximum number of allowed selected issues';

// Not setting "visible" as a variable since we're controlling rendering at a
// higher level
export const MaxSelectionsAlert = ({ closeModal }) => (
  <Modal title={maxSelected} status="warning" onClose={closeModal} visible>
    You are limited to 100 selected issues for each Notice of Disagreement
    request. If you would like to select more than 100, please submit this
    request and create a new request for the remaining issues.
  </Modal>
);

export const missingIssuesErrorMessageText =
  'Please add and select an issue, or select an eligible issue on the previous page';
export const missingIssuesErrorMessage = (
  <span className="usa-input-error-message" role="alert">
    <span className="sr-only">Error</span>
    {missingIssuesErrorMessageText}
  </span>
);

export const addIssuesIntroLabel =
  'Would you like to add any more issues for review?';

export const AdditionalIssuesLabel = (
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
