import React from 'react';

const VerifiedSuccessStatement = () => {
  return (
    <div>
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
        id="success-alert"
      >
        <div
          slot="headline"
          className="
            vads-u-font-size--h2
            vads-u-font-weight--bold
            vye-h2-style-as-h3
          "
        >
          You have successfully verified your enrollment
        </div>
        <p className="vads-u-margin-top--2">
          Your verification will be submitted for processing during the next
          regular business day. Your payment will be deposited within 4 to 6
          business days.
        </p>
      </va-alert>
    </div>
  );
};

export default VerifiedSuccessStatement;
