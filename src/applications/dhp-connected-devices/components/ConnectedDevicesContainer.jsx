import React, { useEffect, useState } from 'react';
import { DevicesToConnectSection } from './DevicesToConnectSection';
import { ConnectedDevicesSection } from './ConnectedDevicesSection';
import { authorizeWithVendor } from '../helpers';

export const ConnectedDevicesContainer = () => {
  const [connectedDevices, setConnectedDevices] = useState([
    {
      vendor: 'Fitbit',
      key: 'fitbit',
      authUrl: `/fitbit`,
      disconnectUrl: 'placeholder',
      connected: false,
    },
  ]);
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

  const authorizeDevice = async device => {
    try {
      await authorizeWithVendor(device.authUrl);
    } catch (error) {
      showFailureAlert();
    }
  };

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
        <DevicesToConnectSection
          connectedDevices={connectedDevices}
          onClickHandler={authorizeDevice}
        />
      </div>
    </>
  );
};
