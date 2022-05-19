import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { DevicesToConnectSection } from './DevicesToConnectSection';
import { ConnectedDevicesSection } from './ConnectedDevicesSection';
import { FETCH_CONNECTED_DEVICES } from '../actions/api';

export const ConnectedDevicesContainer = () => {
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);
  const [disconnectSuccessAlert, setDisconnectSuccessAlert] = useState(false);
  const [disconnectFailureAlert, setDisconnectFailureAlert] = useState(false);

  // TODO: REFACTOR SHOW ALERT
  const showSuccessAlert = () => {
    setSuccessAlert(true);
  };

  const showDisconnectSuccessAlert = () => {
    setDisconnectSuccessAlert(true);
  };

  const showDisconnectFailureAlert = () => {
    setDisconnectFailureAlert(true);
  };

  const showFailureAlert = () => {
    setFailureAlert(true);
  };

  const showAlert = (vendor, status) => {
    if (status === 'success') {
      showSuccessAlert();
    } else if (status === 'error') {
      showFailureAlert();
    } else if (status === 'disconnect-success') {
      showDisconnectSuccessAlert();
    } else if (status === 'disconnect-error') {
      showDisconnectFailureAlert();
    }
  };

  // run after initial render
  useEffect(() => {
    const getConnectedDevices = async () => {
      // fetch from endpoint that returns json
      try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await apiRequest(FETCH_CONNECTED_DEVICES, { headers });
        setConnectedDevices(response?.devices);
      } catch (err) {
        // console.error('getConnectedDevices error:', err);
      }
    };
    getConnectedDevices();
  }, []);
  // run if updates to successAlert, failureAlert states
  useEffect(
    () => {
      const handleRedirectQueryParams = () => {
        const resUrl = new URL(window.location);
        resUrl.searchParams.forEach((status, vendor) => {
          showAlert(vendor, status);
        });
      };
      handleRedirectQueryParams();
    },
    [
      successAlert,
      failureAlert,
      disconnectSuccessAlert,
      disconnectFailureAlert,
    ],
  );

  return (
    <>
      <h2>Your connected devices</h2>
      <div data-testid="connected-devices-section">
        <ConnectedDevicesSection
          connectedDevices={connectedDevices}
          successAlert={successAlert}
          failureAlert={failureAlert}
          disconnectSuccessAlert={disconnectSuccessAlert}
          disconnectFailureAlert={disconnectFailureAlert}
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
