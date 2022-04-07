import React, { useState } from 'react';
import environment from 'platform/utilities/environment';
import { DevicesToConnectSection } from './DevicesToConnectSection';
import { ConnectedDevicesSection } from './ConnectedDevicesSection';
import { authorizeWithVendor } from '../helpers';

export const ConnectedDevicesContainer = () => {
  const [connectedDevices, setConnectedDevices] = useState([
    {
      vendor: 'Fitbit',
      authUrl: `${environment.API_URL}/dhp_connected_devices/fitbit`,
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

  function handleResponse(response, device) {
    try {
      const resUrl = new URL(response.url);
      const deviceWasAbleToConnect = resUrl.searchParams.get(
        device.vendor.toLowerCase(),
      );

      if (deviceWasAbleToConnect === 'success') {
        updateConnectedDevices(device.vendor);
        showSuccessAlert();
      }
      showFailureAlert();
    } catch {
      showFailureAlert();
      // console.error('Something went wrong :(');
    }
  }

  async function authorizeDevice(device) {
    const response = await authorizeWithVendor(device.authUrl);
    handleResponse(response, device);
    return response;
  }

  return (
    <>
      <h2>Your connected devices</h2>
      <ConnectedDevicesSection
        connectedDevices={connectedDevices}
        successAlert={successAlert}
        failureAlert={failureAlert}
        data-testId="connected-devices-section"
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
        data-testId="devices-to-connect-section"
      />
    </>
  );
};
