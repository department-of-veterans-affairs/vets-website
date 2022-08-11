import React from 'react';

const TemporaryOutage = () => (
  <div className="vads-u-margin-bottom--2 medium-screen:vads-u-margin-bottom--4">
    <va-alert
      close-btn-aria-label="Close notification"
      status="warning"
      visible
    >
      <h2 slot="headline">
        Disability compensation and pension benefits is temporarily unavailable
      </h2>

      <p>
        We’re sorry, but disability compensation and pension benefits
        information is currently unavailable due to system maintenance. We’ll
        have this system back online as soon as possible. Please check back
        Monday, August 15th.
      </p>
    </va-alert>
  </div>
);

export default TemporaryOutage;
