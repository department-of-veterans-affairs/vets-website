import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS, WIZARD_STATUS_COMPLETE } from '../../constants';

const ApplyLaterNotification = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_COMPLETE);
    recordEvent({
      event: `howToWizard-notice-displayed`,
      'reason-for-notice': 'chose not to apply now',
    });
  });

  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--primary-alt-lightest">
      <p className="vads-u-margin--0">
        When you’re ready to apply for career planning and guidance, just come
        back to this page to begin your application.
      </p>
    </div>
  );
};

export default {
  name: 'applyLaterNotification',
  component: ApplyLaterNotification,
};
