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
      >
        <Header slot="headline">If you have a presumptive condition</Header>
        <p>
          If you’re filing a claim for a condition that we now consider
          presumptive under a new law or regulation (like the PACT Act), you
          don’t need to submit new evidence. But you do need to review and
          acknowledge this notice of evidence needed.
        </p>
      </VaAlert>
      <Header>Review and acknowledge this notice of evidence needed.</Header>
      <p>
        Unless you’re filing a claim for a presumptive condition, we encourage
        you to submit new evidence. This evidence must be related to the issue
        you’re claiming, and it must be evidence we haven’t reviewed before.
      </p>
      <p>We’ll look for evidence that shows both of these are true:</p>
      <ul>
        <li>
          You have a current physical or mental disability (damage to your body
          or mind that makes you less able—or totally unable—to do everyday
          tasks, including meaningful work), <strong>and</strong>
        </li>
        <li>
          An event, injury, or illness that happened while you were serving in
          the military caused this disability
        </li>
      </ul>
      <p>
        You’ll need to submit or give us permission to gather medical evidence
        from a VA medical center, other federal facility, or your private health
        care provider.
      </p>
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
};

export const reviewField = () => (
  <div className="review-row">
    <dt>{content.label}</dt>
    <dd>Yes, I certify</dd>
  </div>
);
