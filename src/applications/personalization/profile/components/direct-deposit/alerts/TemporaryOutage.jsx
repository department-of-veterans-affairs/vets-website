import React from 'react';

export const TemporaryOutage = () => (
  <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
      uswds
    >
      <h2 slot="headline">
        Direct deposit information isn’t available right now
      </h2>

      <p>
        We’re sorry. Direct deposit information isn’t available right now. We’re
        doing some maintenance work on this system.
      </p>
      <p className="vads-u-margin-bottom--0">
        Refresh this page or try again later.
      </p>
    </va-alert>
  </div>
);
