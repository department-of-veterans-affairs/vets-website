import React from 'react';

const NoHealthAlert = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="info"
      visible
      data-testid="no-health-message"
    >
      <h2 slot="headline">We cannot display your health information.</h2>
      <div>
        <p className="vads-u-margin-y--0">
          Only patients who have received care at a VA facility can use VA.gov
          health tools. If you believe you have registered or received care at a
          VA medical center, clinic, or Vet center, please call that facility to
          find out if you’re in their records.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/find-locations">Find a facility phone number</a>
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/health-care">Apply here for healthcare</a>
        </p>
      </div>
    </va-alert>
  );
};

export default NoHealthAlert;
