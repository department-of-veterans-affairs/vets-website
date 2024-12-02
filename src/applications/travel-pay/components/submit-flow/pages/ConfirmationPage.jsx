import React, { useEffect } from 'react';

import scrollToTop from 'platform/utilities/ui/scrollToTop';
import { focusElement } from 'platform/utilities/ui';

const ConfirmationPage = () => {
  useEffect(() => {
    focusElement('h2');
    scrollToTop('topScrollElement');
  }, []);

  return (
    <div className="vads-u-margin--3">
      <div className="print-only">
        <img
          src="https://www.va.gov/img/design/logo/logo-black-and-white.png"
          alt="VA logo"
          width="300"
        />
        <h2>Application for Beneficiary Travel Reimbursement</h2>
      </div>
      <h2 className="vads-u-font-size--h3">
        Your travel claim has been submitted
      </h2>
      <p>
        Claim ID: <strong>12345</strong>.
      </p>
      <p>We may contact you for more information or documents.</p>
      <p className="screen-only">You may print this page for your records.</p>
    </div>
  );
};

export default ConfirmationPage;
