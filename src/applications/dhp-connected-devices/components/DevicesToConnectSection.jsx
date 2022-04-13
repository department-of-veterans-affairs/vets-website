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
        <p data-testId="all-devices-connected-alert">
          You have connected all supported devices
        </p>
      )}
      {!areAllDevicesConnected() && devicesToConnectMapped()}
    </>
  );
};

DevicesToConnectSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
};
