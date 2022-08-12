import React from 'react';

import recordEvent from 'platform/monitoring/record-event';

import pageNames from './pageNames';

const content = {
  linkText: 'Learn about the decision review process',
};

const DisagreeFileClaimPage = () => {
  recordEvent({
    event: 'howToWizard-alert-displayed',
    'reason-for-alert': 'disagree with VA decision, needs a decision review',
  });
  return (
    <>
      <h1 className="vads-u-margin-bottom--0">
        You can’t file a disability Claim
      </h1>
      <div
        id={pageNames.disagreeFileClaim}
        className="usa-alert usa-alert-info background-color-only vads-u-padding--2 vads-u-margin-top--2"
      >
        <span className="sr-only">Info: </span>
        <p className="vads-u-margin-top--0">
          If you disagree with a VA decision on your claim, you’ll need to
          request a decision review.
        </p>
        <a
          href="/decision-reviews/"
          onClick={() => {
            recordEvent({
              event: 'howToWizard-alert-link-click',
              'howToWizard-alert-link-click-label': content.linkText,
            });
          }}
        >
          {content.linkText}
        </a>
      </div>
    </>
  );
};

export default {
  name: pageNames.disagreeFileClaim,
  component: DisagreeFileClaimPage,
  back: pageNames.appeals,
  next: null,
};
