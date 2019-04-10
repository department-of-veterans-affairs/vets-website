import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision that you received more than a year ago,
      you can file a Supplemental Claim.
    </p>
    <a href="/decision-reviews/supplemental-claim/">
      Find out how to file a Supplemental Claim
    </a>
  </>
);

const DisagreeFileClaimPage = () => (
  <AlertBox
    status="warning"
    headline="You’ll need to file a Supplemental Claim"
    content={alertContent}
  />
);

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
