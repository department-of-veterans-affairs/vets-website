import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import { pageNames } from './pageList';

const DisagreeFileClaimPage = () => {
  const linkText = 'Learn about the decision review process';

  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'disagree with VA decision, needs a decision review',
  });
  return (
    <div
      id={pageNames.disagreeFileClaim}
      className="usa-alert usa-alert-info background-color-only vads-u-padding--2 vads-u-margin-top--2"
    >
      <span className="sr-only">Info: </span>
      <p className="vads-u-margin-top--0">
        If you disagree with a VA decision on your claim, you’ll need to request
        a decision review.
      </p>
      <a
        href="/decision-reviews/"
        onClick={() => {
          recordEvent({
            event: 'howToWizard-alert-link-click',
            'howToWizard-alert-link-click-label': linkText,
          });
        }}
      >
        {linkText}
      </a>
    </div>
  );
};

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
};
