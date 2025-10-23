import React from 'react';

export const ContestableIssuesAdditionalInfo = (
  <va-additional-info
    trigger="Why isn’t my issue listed here?"
    class="vads-u-margin-top--3 vads-u-margin-bottom--4"
  >
    If you don’t see your issue or decision listed here, it may not be in our
    system yet. This can happen if it’s a more recent claim decision. If you
    have a decision date, you can add a new issue now.
  </va-additional-info>
);

export const removeModalContent = {
  title: 'Are you sure you want to remove this issue?',
  description: issueName => (
    <span>
      We’ll remove{' '}
      <strong
        className="dd-privacy-hidden word-break-all"
        data-dd-action-name="issue name"
      >
        {issueName}
      </strong>{' '}
      from the issues you’d like us to review
    </span>
  ),
  yesButton: 'Yes, remove this',
  noButton: 'No, keep this',
};
