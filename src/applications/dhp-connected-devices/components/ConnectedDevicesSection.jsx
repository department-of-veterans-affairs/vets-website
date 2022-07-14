import PropTypes from 'prop-types';
import React from 'react';
import { DeviceDisconnectionCard } from './DeviceDisconnectionCard';
import { DeviceConnectionAlert } from './DeviceConnectionAlerts';

export const ConnectedDevicesSection = ({
  connectedDevices,
  successAlert,
  failureAlert,
  disconnectSuccessAlert,
  disconnectFailureAlert,
}) => {
  const areDevicesConnected = () => {
    try {
      return connectedDevices.some(device => device.connected);
    } catch (err) {
      return false;
    }
  };

  const connectedDevicesMapped = () => {
    try {
      return connectedDevices.map(device => {
        if (device.connected) {
          return <DeviceDisconnectionCard device={device} key={device.key} />;
        }
        return <></>;
      });
    } catch (err) {
      return (
        <p data-testid="no-devices-connected-alert">
          You do not have any devices connected.
        </p>
      );
    }
  };
  // TODO: REFACTOR ALERT TO CONNECTION ALERT
  return (
    <>
      {successAlert && (
        <DeviceConnectionAlert
          testId="connection-success-alert"
          status="success"
          headline="Device connected"
          description="Your device is now connected."
        />
      )}
      {failureAlert && (
        <DeviceConnectionAlert
          testId="connection-failure-alert"
          status="error"
          headline="We couldn’t connect your device"
          description="We were not able to connect to your device right now. Please try
          again."
        />
      )}
      {disconnectSuccessAlert && (
        <DeviceConnectionAlert
          testId="disconnection-success-alert"
          status="success"
          headline="Device disconnected"
          description="Your device is no longer sharing data with the VA."
        />
      )}
      {disconnectFailureAlert && (
        <DeviceConnectionAlert
          testId="disconnection-failure-alert"
          status="error"
          headline="We couldn't disconnect your device"
          description="We were not able to disconnect your device right now. Please try again."
        />
      )}
      {!areDevicesConnected() && (
        <p data-testid="no-devices-connected-alert">
          You do not have any devices connected.
        </p>
      )}
      {areDevicesConnected() && connectedDevicesMapped()}
    </>
  );
};

ConnectedDevicesSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
  disconnectFailureAlert: PropTypes.bool.isRequired,
  disconnectSuccessAlert: PropTypes.bool.isRequired,
  failureAlert: PropTypes.bool.isRequired,
  successAlert: PropTypes.bool.isRequired,
};
