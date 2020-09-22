import React, { useEffect } from 'react';
import {
  WIZARD_STATUS,
  WIZARD_STATUS_INELIGIBLE,
  CAREERS_EMPLOYMENT_ROOT_URL,
} from '../../constants';

const IneligibleNotice = () => {
  useEffect(() => {
    sessionStorage.setItem(WIZARD_STATUS, WIZARD_STATUS_INELIGIBLE);
  });
  return (
    <div className="vads-u-margin-top--2 vads-u-padding--3 vads-u-background-color--primary-alt-lightest">
      <p className="vads-u-margin-top--0 vadsu-margin-bottom--1">
        To be eligible for Chapter 36 career planning and guidance, you must be
        a Veteran or service member, or a dependent of one.
      </p>
      <a href={CAREERS_EMPLOYMENT_ROOT_URL}>
        Find out more about VA educational and career counseling
      </a>
    </div>
  );
};

export default {
  name: 'ineligibleNotice',
  component: IneligibleNotice,
};
