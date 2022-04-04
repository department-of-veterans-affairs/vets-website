import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DeviceConnectionCard } from './DeviceConnectionCard';
import { DeviceDisconnectionCard } from './DeviceDisconnectionCard';
import {
  DeviceConnectionFailedAlert,
  DeviceConnectionSucceededAlert,
} from './DeviceConnectionAlerts';

export const ConnectedDevicesContainer = () => {
  const [connectedDevices, setConnectedDevices] = useState([
    {
      vendor: 'Fitbit',
      authUrl: 'path/to/vetsapi/fitbit/connect/method',
      disconnectUrl: 'placeholder',
      connected: false,
    },
    {
      vendor: 'Freestyle Libre',
      authUrl: 'path/to/vetsapi/freestyle/connect/method',
      disconnectUrl: 'placeholder',
      connected: false,
    },
  ]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);

  function updateConnectedDevices(vendor) {
    const connectedDevicesCopy = [...connectedDevices];
    const device =
      connectedDevicesCopy[
        connectedDevices.findIndex(d => d.vendor === vendor)
      ];
    device.connected = true;
    setConnectedDevices(connectedDevicesCopy);
  }

  function showSuccessAlert() {
    setSuccessAlert(true);
  }

  function showFailureAlert() {
    setFailureAlert(true);
  }

  async function authorizeDevice(device) {
    // const response = await fetch(authUrl);
    const response = 'success';
    // console.log(device.authUrl);
    // console.log(response);
    if (response === 'success') {
      updateConnectedDevices(device.vendor);
      showSuccessAlert();
      return response;
    }
    showFailureAlert();
    return response;
  }

  return (
    <>
      <h2>Your connected devices</h2>
      <ConnectedDevicesSection
        connectedDevices={connectedDevices}
        successAlert={successAlert}
        failureAlert={failureAlert}
      />
      <h2>Devices you can connect</h2>
      <div>
        Choose a device type below to connect. You will be directed to an
        external website and asked to enter your sign in information for that
        device. When complete, you will return to this page on VA.gov.
      </div>

      <DevicesToConnectSection
        connectedDevices={connectedDevices}
        onClickHandler={authorizeDevice}
      />
    </>
  );
};

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
            key={device.vendor}
            vendor={device.vendor}
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
        <p data-testId="no-devices-connected-alert">
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

export const DevicesToConnectSection = ({
  connectedDevices,
  onClickHandler,
}) => {
  const areAllDevicesConnected = () => {
    return connectedDevices.every(device => device.connected);
  };
  const devicesToConnectMapped = () => {
    return connectedDevices.map(device => {
      if (!device.connected) {
        return (
          <DeviceConnectionCard
            key={device.vendor}
            vendor={device.vendor}
            onClickHandler={() => onClickHandler(device)}
          />
        );
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
  onClickHandler: PropTypes.func.isRequired,
};
