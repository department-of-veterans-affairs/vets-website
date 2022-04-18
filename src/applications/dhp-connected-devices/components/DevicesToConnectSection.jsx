import PropTypes from 'prop-types';
import React from 'react';
import { DeviceConnectionCard } from './DeviceConnectionCard';

export const DevicesToConnectSection = ({ connectedDevices }) => {
  const areAllDevicesConnected = () => {
    return connectedDevices.every(device => device.connected);
  };
  const devicesToConnectMapped = () => {
    return connectedDevices.map(device => {
      if (!device.connected) {
        return <DeviceConnectionCard key={device.vendor} device={device} />;
      }
      return <></>;
    });
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
