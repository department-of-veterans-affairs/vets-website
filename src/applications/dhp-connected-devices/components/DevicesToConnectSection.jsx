import PropTypes from 'prop-types';
import React from 'react';
import { DeviceConnectionCard } from './DeviceConnectionCard';
import { DeviceConnectionAlert } from './DeviceConnectionAlerts';

export const DevicesToConnectSection = ({
  connectedDevices,
  connectionAvailable,
}) => {
  const areAllDevicesConnected = () => {
    try {
      return connectedDevices.every(device => device.connected);
    } catch (err) {
      return false;
    }
  };
  const devicesToConnectMapped = () => {
    try {
      return connectedDevices
        .filter(device => !device.connected)
        .map(device => {
          return <DeviceConnectionCard key={device.key} device={device} />;
        });
    } catch (err) {
      return (
        <p data-testid="all-devices-connected-alert">
          There are no devices available to connect.
        </p>
      );
    }
  };

  const error = () => {
    return (
      <DeviceConnectionAlert
        testId="connection-unavailable-alert"
        status="error"
        headline="Unable to connect health device"
        description="We're sorry, but your VA.gov user account is not configured to connect to health devices at this time. Please contact DHP-pilot@va.gov."
      />
    );
  };

  const devicesToConnect = () => {
    return (
      <>
        <div>
          Choose a device type below to connect. You will be directed to an
          external website and asked to enter your sign in information for that
          device. When complete, you will return to this page on VA.gov.
        </div>
        {areAllDevicesConnected() && (
          <p data-testid="all-devices-connected-alert">
            There are no devices available to connect.
          </p>
        )}
        {!areAllDevicesConnected() && devicesToConnectMapped()}
      </>
    );
  };

  return connectionAvailable ? devicesToConnect() : error();
};

DevicesToConnectSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
};
