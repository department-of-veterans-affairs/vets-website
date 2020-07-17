import React from 'react';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import EbenefitsLink from 'platform/site-wide/ebenefits/containers/EbenefitsLink';

export default function LogoutAlert() {
  const content = (
    <>
      <strong>Looking for other VA benefits or services?</strong>
      <a
        href="/"
        className="vads-u-display--block vads-u-margin-y--1"
        target="_blank"
      >
        VA.gov
      </a>
      <a
        href="https://www.myhealth.va.gov"
        className="vads-u-display--block vads-u-margin-y--1"
        target="blank"
      >
        My HealtheVet
      </a>
      <EbenefitsLink className="vads-u-display--block vads-u-margin-y--1">
        eBenefits
      </EbenefitsLink>
    </>
  );
  return (
    <AlertBox
      headline="You have successfully signed out."
      content={content}
      status="success"
      className="vads-u-margin-bottom--6"
    />
  );
}
