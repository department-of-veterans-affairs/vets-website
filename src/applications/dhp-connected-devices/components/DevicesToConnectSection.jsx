import PropTypes from 'prop-types';
import React from 'react';
import { DeviceConnectionCard } from './DeviceConnectionCard';

export const DevicesToConnectSection = ({ connectedDevices }) => {
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

  return (
    <>
      {areAllDevicesConnected() && (
        <p data-testid="all-devices-connected-alert">
          There are no devices available to connect.
        </p>
      )}
      {!areAllDevicesConnected() && devicesToConnectMapped()}
    </>
  );
};

DevicesToConnectSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
};
