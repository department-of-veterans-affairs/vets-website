import React from 'react';

export const ContestableIssuesLegend = () => (
  <>
    <legend className="vads-u-width--full vads-u-padding-top--0 vads-u-border-top--0">
      <h1 className="vads-u-font-size--h1 vads-u-margin-top--0">
        Select the issues you’d like us to review
      </h1>
    </legend>
    <p className="vads-u-margin-top--0 vads-u-margin-bottom--2">
      These are the issues we have on file for you. If you don’t see the issue
      you want us to review, you can add a new issue.
    </p>
    <p>Please select the issue(s) you’d like us to review</p>
  </>
);

export const ContestableIssuesAdditionalInfo = (
  <va-additional-info
    trigger="Why isn’t my issue listed here?"
    class="vads-u-margin-y--4"
    uswds
  >
    If you don’t see your issue or decision listed here, it may not be in our
    system yet. This can happen if it’s a more recent claim decision. If you
    have a decision date, you can add a new issue now. You can now{' '}
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <a href="#">view your decision notices online</a>.
  </va-additional-info>
);
