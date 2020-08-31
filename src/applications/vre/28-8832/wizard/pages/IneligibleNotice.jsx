import React, { useEffect } from 'react';
import { WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE } from '../../constants';

const IneligibleNotice = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--primary-alt-lightest">
      <p className="vads-u-margin--0">
        To be eligible for Chapter 36 career planning and guidance, you must be
        a Veteran or service member, or a dependent of one.
      </p>
      <a href="/careers-employment/education-and-career-counseling/">
        Find out more about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: 'ineligibleNotice',
  component: IneligibleNotice,
};
