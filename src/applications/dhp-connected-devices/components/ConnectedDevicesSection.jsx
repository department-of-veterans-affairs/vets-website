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
          return (
            <DeviceDisconnectionCard
              device={device}
              key={device.key}
              onClickHandler={() => {
                // console.log('Disconnect');
              }}
            />
          );
        }
        return <></>;
      });
    } catch (err) {
      return (
        <p data-testid="no-devices-connected-alert">
          You do not have any devices connected
        </p>
      );
    }
  };

  return (
    <>
      {successAlert && <DeviceConnectionSucceededAlert />}
      {failureAlert && <DeviceConnectionFailedAlert />}
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
  failureAlert: PropTypes.bool.isRequired,
  successAlert: PropTypes.bool.isRequired,
};
