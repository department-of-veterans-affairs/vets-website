import React from 'react';
import PropTypes from 'prop-types';

export const DeviceConnectionSucceededAlert = () => {
  return (
    <div data-testid="success-alert">
      <va-alert
        close-btn-aria-label="Close notification"
        status="success"
        visible
      >
        <h3 slot="headline">Device connected</h3>
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
          We were not able to connect to your device right now. Please try
          again.
        </div>
      </va-alert>
    </div>
  );
};

export const DeviceConnectionAlert = ({
  testId,
  status,
  headline,
  description,
}) => {
  return (
    <div data-testid={testId}>
      <va-alert
        close-btn-aria-label="Close notification"
        status={status}
        visible
      >
        <h3 slot="headline">{headline}</h3>
        <div>{description}</div>
      </va-alert>
    </div>
  );
};

DeviceConnectionAlert.propTypes = {
  description: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};
