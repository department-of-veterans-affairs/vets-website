import React, { useEffect } from 'react';
import recordEvent from 'platform/monitoring/record-event';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_INELIGIBLE,
  CAREERS_EMPLOYMENT_ROOT_URL,
} from '../../constants';

const IneligibleNotice = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
    recordEvent({
      event: `howToWizard-notice-displayed`,
      'reason-for-notice': 'ineligibility - not a service member or veteran',
    });
  });
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--gray-lightest">
      <p className="vads-u-margin-top--0 vadsu-margin-bottom--1">
        To be eligible for Chapter 36 career planning and guidance, you must be
        a Veteran or service member, or a dependent of one.
      </p>
      <a href={CAREERS_EMPLOYMENT_ROOT_URL}>
        Learn more about VA career planning and guidance
      </a>
    </div>
  );
};

export default {
  name: 'ineligibleNotice',
  component: IneligibleNotice,
};
