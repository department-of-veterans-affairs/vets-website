import React from 'react';

export default function AgeEligibilityUnderEighteen() {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="error"
      visible
      role="alert"
    >
      <h2 slot="headline">You do not qualify</h2>
      <React.Fragment key=".1">
        <p className="vads-u-margin-y--0">
          You must be 18 or older to submit this application.
        </p>
      </React.Fragment>
    </va-alert>
  );
}
