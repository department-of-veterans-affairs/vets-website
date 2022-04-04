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
      vendor: 'FreestyleLibre',
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
  return (
    <>
      {successAlert ? <DeviceConnectionSucceededAlert /> : ''}
      {failureAlert ? <DeviceConnectionFailedAlert /> : ''}
      {connectedDevices.map(device => {
        if (device.connected) {
          return (
            <DeviceDisconnectionCard
              vendor={device.vendor}
              onClickHandler={() => {
                // console.log('Disconnect');
              }}
            />
          );
        }
        return <></>;
      })}
      <div>You do not have any devices connected</div>
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
  return (
    <>
      {connectedDevices.map(device => {
        if (!device.connected) {
          return (
            <DeviceConnectionCard
              vendor={device.vendor}
              onClickHandler={() => onClickHandler(device)}
            />
          );
        }
        return <></>;
      })}
    </>
  );
};

DevicesToConnectSection.propTypes = {
  connectedDevices: PropTypes.array.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};
