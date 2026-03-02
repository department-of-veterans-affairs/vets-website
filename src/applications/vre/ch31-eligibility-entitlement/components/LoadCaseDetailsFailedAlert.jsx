import React from 'react';

export default function LoadCaseDetailsFailedAlert() {
  return (
    <div className="vads-u-margin-y--3">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h2 slot="headline">We can't load the Case Progress right now</h2>
        <p>
          We are sorry. There is a problem with our system. Please wait a few
          minutes and try again.
        </p>
      </va-alert>
    </div>
  );
}
