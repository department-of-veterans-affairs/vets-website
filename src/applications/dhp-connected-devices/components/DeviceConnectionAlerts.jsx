import React from 'react';

export const DeviceConnectionSucceededAlert = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="success"
      data-testId="success-alert"
      visible
    >
      <h3 slot="headline">Device Connected</h3>
      <div>Your device is now connected.</div>
    </va-alert>
  );
};

export const DeviceConnectionFailedAlert = () => {
  return (
    <va-alert
      close-btn-aria-label="Close notification"
      status="error"
      data-testId="failure-alert"
      visible
    >
      <h3 slot="headline">We couldn’t connect your device</h3>
      <div>
        We were not able to connect to your device now. Please try again.
      </div>
    </va-alert>
  );
};
