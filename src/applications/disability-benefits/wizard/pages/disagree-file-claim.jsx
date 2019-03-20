import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision that you received more than a year ago,
      you’ll need to file a new disability claim.
    </p>
    <a
      href="/disability/file-disability-claim-form-21-526ez/introduction"
      className="usa-button-primary va-button-primary"
    >
      File a Disability Compensation Claim
    </a>
  </>
);

const DisagreeFileClaimPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to file a new claim"
    content={alertContent}
  />
);

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
