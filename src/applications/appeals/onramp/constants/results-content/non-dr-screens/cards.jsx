import React from 'react';

export const DISABILITY_COMP_CARD = explanation => (
  <va-card>
    <h2 className="vads-u-margin-top--0">Disability Compensation Claim</h2>
    <p>{explanation}</p>
    <va-link
      external
      class="vads-u-display--block vads-u-margin-bottom--2"
      href="/disability/how-to-file-claim"
      text="Learn more about Disability Benefits"
    />
    <va-link-action
      href="/disability/file-disability-claim-form-21-526ez/introduction"
      text="Start disability compensation application"
    />
  </va-card>
);

export const CLAIM_FOR_INCREASE_CARD = (
  <va-card>
    <h2 className="vads-u-margin-top--0">Claim for increase</h2>
    <p>
      This may be a good fit because your condition has worsened since the
      decision on your initial claim.
    </p>
    <p>
      <strong>Note:</strong> You’ll need to submit evidence with your claim.
    </p>
    <va-link
      external
      class="vads-u-display--block vads-u-margin-bottom--2"
      href="/disability/how-to-file-claim/evidence-needed/#what-should-the-evidence-show-"
      text="Learn more about evidence for a claim for increase"
    />
    <va-link-action
      href="/disability/file-disability-claim-form-21-526ez/introduction"
      text="Start disability compensation application"
    />
  </va-card>
);
