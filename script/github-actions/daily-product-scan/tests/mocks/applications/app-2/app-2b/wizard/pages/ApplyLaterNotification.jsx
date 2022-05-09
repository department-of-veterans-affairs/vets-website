import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS_COMPLETE } from 'applications/static-pages/wizard';

const ApplyLaterNotification = props => {
  const { setWizardStatus } = props;
  useEffect(() => {
    setWizardStatus(WIZARD_STATUS_COMPLETE);
    recordEvent({
      event: `howToWizard-alert-displayed`,
      'reason-for-alert': 'chose not to apply now',
    });
  });

  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest">
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
