import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { DevicesToConnectSection } from './DevicesToConnectSection';
import { ConnectedDevicesSection } from './ConnectedDevicesSection';
import { FETCH_CONNECTED_DEVICES } from '../actions/api';

// const devices = [
//   {
//     vendor: 'vendor-1',
//     key: 'vendor1',
//     authUrl: 'path/to/vetsapi/vendor-1/connect/method',
//     disconnectUrl: 'path/to/vetsapi/vendor-1/disconnect/method',
//     connected: true,
//   },
//   {
//     vendor: 'vendor-2',
//     key: 'vendor2',
//     authUrl: 'path/to/vetsapi/vendor-2/connect/method',
//     disconnectUrl: 'path/to/vetsapi/vendor-2/disconnect/method',
//     connected: false,
//   },
// ];

export const ConnectedDevicesContainer = () => {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);

  const updateConnectedDevices = vendor => {
    const connectedDevicesCopy = [...connectedDevices];
    const device =
      connectedDevicesCopy[connectedDevices.findIndex(d => d.key === vendor)];
    device.connected = true;
    setConnectedDevices(connectedDevicesCopy);
  };

  const showSuccessAlert = () => {
    setSuccessAlert(true);
  };

  const showFailureAlert = () => {
    setFailureAlert(true);
  };

  const showConnectionAlert = (vendor, status) => {
    if (status === 'success') {
      updateConnectedDevices(vendor);
      showSuccessAlert();
    } else if (status === 'error') {
      showFailureAlert();
    }
  };

  // run after initial render
  useEffect(() => {
    const getConnectedDevices = async () => {
      // fetch from endpoint that returns json
      try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await apiRequest(FETCH_CONNECTED_DEVICES, { headers });
        setConnectedDevices(response?.data?.devices);
      } catch (err) {
        // console.error('getConnectedDevices error:', err);
      }
      // setConnectedDevices(devices);
    };
    getConnectedDevices();
  }, []);
  // run if updates to successAlert, failureAlert states
  useEffect(
    () => {
      const handleRedirectQueryParams = () => {
        const resUrl = new URL(window.location);
        resUrl.searchParams.forEach((status, vendor) => {
          showConnectionAlert(vendor, status);
        });
      };
      handleRedirectQueryParams();
    },
    [successAlert, failureAlert],
  );

  return (
    <>
      <h2>Your connected devices</h2>
      <div data-testid="connected-devices-section">
        <ConnectedDevicesSection
          connectedDevices={connectedDevices}
          successAlert={successAlert}
          failureAlert={failureAlert}
        />
      </div>
      <h2>Devices you can connect</h2>
      <div>
        Choose a device type below to connect. You will be directed to an
        external website and asked to enter your sign in information for that
        device. When complete, you will return to this page on VA.gov.
      </div>

      <div data-testid="devices-to-connect-section">
        <DevicesToConnectSection connectedDevices={connectedDevices} />
      </div>
    </>
  );
};
