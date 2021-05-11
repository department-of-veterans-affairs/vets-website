import React from 'react';

export const missingIssueErrorMessage = 'Please add the name of an issue';

export const missingIssuesErrorMessage = (
  <span className="usa-input-error-message" role="alert">
    <span className="sr-only">Error</span>
    Please add and select an issue, or select an eligible issue on the previous
    page
  </span>
);

export const AddIssuesIntroTitle = (
  <p>
    If the issue you were looking for was not in our system, you can add it
    manually. You can only add an issue that you’ve already received a VA
    decision notice for.
  </p>
);

export const addIssuesIntroLabel =
  'Would you like to add any additional issues for review?';

export const AdditionalIssuesLabel = (
  <span className="vads-u-font-weight--normal vads-u-font-size--base vads-u-font-family--sans">
    Add an issue and our decision date on this issue. You can find the decision
    date on your decision notice (the letter you got in the mail from us).
  </span>
);
