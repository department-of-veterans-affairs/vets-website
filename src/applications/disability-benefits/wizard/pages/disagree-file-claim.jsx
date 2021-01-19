import React from 'react';

import { pageNames } from './pageList';

const DisagreeFileClaimPage = () => (
  <div className="vads-u-background-color--gray-lightest vads-u-padding--2 vads-u-margin-top--2">
    <p className="vads-u-margin-top--0">
      If you disagree with a VA decision on your claim, you’ll need to request a
      decision review.
    </p>
    <a href="/decision-reviews/">Learn about the decision review process</a>
  </div>
);

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
