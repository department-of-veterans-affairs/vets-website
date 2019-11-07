import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { pageNames } from './pageList';

const alertContent = (
  <>
    <p>
      If you disagree with a VA decision we made over a year ago, you need to
      file a Supplemental Claim (VA Form 20-0995).
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
