import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import { CAREERS_EMPLOYMENT_ROOT_URL } from '../../constants';

const IneligibleNotice = () => {
  useEffect(() => {
    recordEvent({
      event: `howToWizard-notice-displayed`,
      'reason-for-alert': 'ineligibility - not a service member or veteran',
    });
  });
  const handleClick = () => {
    recordEvent({
      event: `howToWizard-alert-link-click`,
      'howToWizard-alert-link-click-label':
        'Learn more about VA career planning and guidance',
    });
  };
  return (
    <div
      id="ineligibleNotice"
      className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest"
    >
      <p className="vads-u-margin-top--0 vadsu-margin-bottom--1">
        To be eligible for Chapter 36 career planning and guidance, you must be
        a Veteran or service member, or a dependent of one.
      </p>
      <a onClick={handleClick} href={CAREERS_EMPLOYMENT_ROOT_URL}>
        Learn more about VA career planning and guidance
      </a>
    </div>
  );
};

export default {
  name: 'ineligibleNotice',
  component: IneligibleNotice,
};
