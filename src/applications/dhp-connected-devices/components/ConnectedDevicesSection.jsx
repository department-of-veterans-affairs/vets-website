import PropTypes from 'prop-types';
import React from 'react';
import { DeviceDisconnectionCard } from './DeviceDisconnectionCard';
import {
  DeviceConnectionFailedAlert,
  DeviceConnectionSucceededAlert,
} from './DeviceConnectionAlerts';

export const ConnectedDevicesSection = ({
  connectedDevices,
  successAlert,
  failureAlert,
}) => {
  const areDevicesConnected = () => {
    return connectedDevices.some(device => device.connected);
  };

  const connectedDevicesMapped = () => {
    return connectedDevices.map(device => {
      if (device.connected) {
        return (
          <DeviceDisconnectionCard
            device={device}
            onClickHandler={() => {
              // console.log('Disconnect');
            }}
          />
        );
      }
      return <></>;
    });
  };

  return (
    <>
      {successAlert && <DeviceConnectionSucceededAlert />}
      {failureAlert && <DeviceConnectionFailedAlert />}
      {!areDevicesConnected() && (
        <p data-testid="no-devices-connected-alert">
          You do not have any devices connected
        </p>
      )}
      {areDevicesConnected() && connectedDevicesMapped()}
    </>
  );
};

ConnectedDevicesSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
  failureAlert: PropTypes.bool.isRequired,
  successAlert: PropTypes.bool.isRequired,
};
