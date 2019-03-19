import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision that you received more than a year ago,
      you’ll need to file a Supplemental Claim. To file a Supplemental Claim,
      fill out the Decision Review Request: Supplemental Claim (VA Form
      20-0995).
    </p>
    <p>
      <a
        href="/decision-reviews/forms/supplemental-claim-20-0995.pdf"
        className="usa-button-primary va-button-primary"
      >
        Download VA Form 20-0995
      </a>
    </p>
    <p>
      <a href="/decision-reviews/supplemental-claim/">
        Learn more about Supplemental Claims
      </a>
    </p>
  </>
);

const FileSupplementalClaimPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to file a Supplemental Claim"
    content={alertContent}
  />
);

export default {
  name: pageNames.fileSupplementalClaim,
  component: FileSupplementalClaimPage,
};
