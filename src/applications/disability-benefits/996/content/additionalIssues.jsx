import React from 'react';

export const missingIssueErrorMessage = 'Please add the name of an issue';
export const noneSelected = 'Please add and select at least one issue';

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
      Add an issue and our decision date on this issue! You can find the
      decision date on your decision notice (the letter you got in the mail from
      us).
    </span>
    <p className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans">
      <strong>Note:</strong> You can only add an issue that you’ve already
      received a VA decision notice for.
    </p>
  </>
);
