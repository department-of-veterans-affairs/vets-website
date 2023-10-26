import React from 'react';

const NoHealthAlert = () => {
  return (
    <va-alert status="warning" visible data-testid="no-health-message">
      <h2 slot="headline">We unable to display your health information.</h2>
      <div>
        <p className="vads-u-margin-y--0">
          Only patients who have registered at a VA facility can use VA.gov
          health tools.
        </p>
        <p className="vads-u-margin-y--0">
          If you believe you have registered or received care at a VA medical
          center, clinic, or Vet center, please call that facility to find out
          find out if you’re in their records.
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/find-locations">Lookup a facility’s phone number</a>
        </p>
        <p className="vads-u-margin-bottom--0">
          <a href="/health-care">Learn more about VA health care</a>
        </p>
      </div>
    </va-alert>
  );
};

export default NoHealthAlert;
