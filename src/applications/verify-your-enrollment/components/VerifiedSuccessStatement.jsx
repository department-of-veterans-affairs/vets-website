import React from 'react';

const VerifiedSuccessStatement = () => {
  return (
    <div>
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <div
          slot="headline"
          className="vads-u-font-size--h2 vads-u-font-weight--bold"
        >
          You have successfully verified your enrollment
        </div>
        <p className="vads-u-margin-top--2">
          Your verification will be submitted for processing during the next
          regular business day. Your payment will be deposited within 3-5
          business days.
        </p>
      </va-alert>
    </div>
  );
};

export default VerifiedSuccessStatement;
