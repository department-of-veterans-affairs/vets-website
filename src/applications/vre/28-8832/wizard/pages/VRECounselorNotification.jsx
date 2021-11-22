import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { VRE_COUNSELOR_ROOT_URL } from '../../constants';

const VRECounselorNotification = () => {
  useEffect(() => {
    recordEvent({
      event: `howToWizard-alert-displayed`,
      'reason-for-alert': 'ineligibility - eligible for chapter 31',
    });
  });

  const handleClick = () => {
    recordEvent({
      event: `howToWizard-alert-link-click`,
      'howToWizard-alert-link-click-label':
        'Contact a Vocational Rehabilitation Counselor',
    });
  };
  return (
    <div className="vads-u-margin-top--2 vads-u-background-color--gray-lightest vads-u-padding--3">
      <p className="vads-u-margin-top--0">
        Please contact your Vocational Rehabilitation Counselor to learn more
        about how to get career planning and guidance benefits.
      </p>
      <a onClick={handleClick} href={VRE_COUNSELOR_ROOT_URL}>
        Contact a Vocational Rehabilitation Counselor
      </a>
    </div>
  );
};

export default {
  name: 'VRECounselorNotification',
  component: VRECounselorNotification,
};
