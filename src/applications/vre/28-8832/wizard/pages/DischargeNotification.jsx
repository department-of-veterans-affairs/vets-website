import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE } from '../../constants';

const DischargeNotification = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
    recordEvent({
      event: `howToWizard-notice-displayed`,
      'reason-for-notice':
        'ineligibility - outside time period from active duty discharge',
    });
  });
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest">
      <p className="vads-u-margin--0">
        To be eligible for career planning and guidance, you or your sponsor
        must have been discharged from active duty in the last year, or have
        less than 6 months until discharge.
      </p>
    </div>
  );
};

export default {
  name: 'dischargeNotification',
  component: DischargeNotification,
};
