import React from 'react';
import { pageNames } from './pageList';

const DisagreeFileClaimPage = () => (
  <div>
    <h4>You'll need to file a new claim</h4>
    <p>
      If you disagree with a VA decision that you received more than a year ago,
      you’ll need to file a new claim.
    </p>
    <a
      href="/disability/file-disability-claim-form-21-526ez/introduction"
      className="usa-button-primary"
    >
      File a Disability Compensation Claim
    </a>
  </div>
);

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
