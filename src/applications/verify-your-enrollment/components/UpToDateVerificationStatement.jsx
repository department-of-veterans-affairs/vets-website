import React from 'react';

const UpToDateVerificationStatement = () => {
  return (
    <div>
      <va-alert
        class="vads-u-margin-bottom--1"
        close-btn-aria-label="Close notification"
        disable-analytics="false"
        full-width="false"
        status="success"
        visible="true"
      >
        <p className="vads-u-margin-y--0">
          You’re up-to-date with your monthly enrollment verification. You’ll be
          able to verify your enrollment next month.
        </p>
      </va-alert>
    </div>
  );
};

export default UpToDateVerificationStatement;
