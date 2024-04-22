import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { VaAlert } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import recordEvent from 'platform/monitoring/record-event';

export const Notice5103Description = ({ onReviewPage }) => {
  const [visibleAlert, setVisibleAlert] = useState(true);
  const Header = onReviewPage ? 'h4' : 'h3';

  const analyticsEvent = {
    'alert-box-type': 'info',
    'alert-box-heading': 'If you have a presumptive condition',
    'alert-box-full-width': false,
    'alert-box-background-only': false,
    'alert-box-closeable': true,
    'reason-for-alert': 'presumptive condition details',
  };

  const hideAlert = () => {
    setVisibleAlert(false);
    recordEvent({ ...analyticsEvent, event: 'int-alert-box-close' });
  };
  if (visibleAlert) {
    recordEvent({ ...analyticsEvent, event: 'visible-alert-box' });
  }

  return (
    <>
      <VaAlert
        status="info"
        closeBtnAriaLabel="Close notification"
        closeable
        onCloseEvent={hideAlert}
        showIcon
        visible={visibleAlert}
        uswds
      >
        <Header slot="headline">If you have a presumptive condition</Header>
        <p>
          If you’re filing a claim for a condition that we now consider
          presumptive under a new law or regulation (like the PACT Act), you can
          submit this form for review.
        </p>
      </VaAlert>
      <Header>Review and acknowledge the notice of evidence needed.</Header>
    </>
  );
};

Notice5103Description.propTypes = {
  onReviewPage: PropTypes.bool,
};

export const content = {
  error:
    'You need to certify that you have reviewed the notice of evidence needed.',
  label: 'I certify that I have reviewed the notice of evidence needed.',
  update: 'Update page',
  updateLabel: 'Update notice of evidence needed page',
  descriptionInCheckbox: (
    <>
      <p>
        If you’re filing a Supplemental Claim more than 1 year after you got
        your decision notice, you’ll need to review and acknowledge our notice
        of evidence needed for your disability claim.
      </p>
      <p>
        <a
          href="/disability/how-to-file-claim/evidence-needed/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Review the notice of evidence needed (opens in a new tab)
        </a>
      </p>
    </>
  ),
};

export const reviewField = ({ children }) => (
  <div className="review-row">
    <dt>{content.label}</dt>
    <dd>
      {children?.props?.formData ? 'Yes, I certify' : 'No, I didn’t certify'}
    </dd>
  </div>
);
