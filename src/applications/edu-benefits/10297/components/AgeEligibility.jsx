import React from 'react';

export default function AgeEligibility() {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">You may not qualify</h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          If you’re over age 62, you may not be eligible for this program. You
          can still fill out the application. We’ll review your information and
          let you know if you don’t qualify.
        </p>
      </React.Fragment>
    </va-alert>
  );
}
