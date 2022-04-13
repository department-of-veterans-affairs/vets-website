import React from 'react';

export const DeviceConnectionSucceededAlert = () => {
  return (
    <div data-testid="success-alert">
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h3 slot="headline">Device Connected</h3>
        <div>Your device is now connected.</div>
      </va-alert>
    </div>
  );
};

export const DeviceConnectionFailedAlert = () => {
  return (
    <div data-testid="failure-alert">
      <va-alert
        close-btn-aria-label="Close notification"
        status="error"
        visible
      >
        <h3 slot="headline">We couldn’t connect your device</h3>
        <div>
          We were not able to connect to your device now. Please try again.
        </div>
      </va-alert>
    </div>
  );
};
