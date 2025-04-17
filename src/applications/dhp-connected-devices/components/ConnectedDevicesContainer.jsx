import React, { useEffect, useState } from 'react';
import { apiRequest } from 'platform/utilities/api';
import { DevicesToConnectSection } from './DevicesToConnectSection';
import { ConnectedDevicesSection } from './ConnectedDevicesSection';
import { FETCH_CONNECTED_DEVICES } from '../actions/api';
import {
  CONNECTION_FAILED_STATUS,
  CONNECTION_SUCCESSFUL_STATUS,
  DISCONNECTION_FAILED_STATUS,
  DISCONNECTION_SUCCESSFUL_STATUS,
} from '../constants/alerts';

export const ConnectedDevicesContainer = () => {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [connectionAvailable, setConnectionAvailable] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [failureAlert, setFailureAlert] = useState(false);
  const [disconnectSuccessAlert, setDisconnectSuccessAlert] = useState(false);
  const [disconnectFailureAlert, setDisconnectFailureAlert] = useState(false);

  const showAlert = (vendor, status) => {
    if (status === CONNECTION_SUCCESSFUL_STATUS) {
      setSuccessAlert(true);
    } else if (status === CONNECTION_FAILED_STATUS) {
      setFailureAlert(true);
    } else if (status === DISCONNECTION_SUCCESSFUL_STATUS) {
      setDisconnectSuccessAlert(true);
    } else if (status === DISCONNECTION_FAILED_STATUS) {
      setDisconnectFailureAlert(true);
    }
  };

  // run after initial render
  useEffect(() => {
    const getConnectedDevices = async () => {
      // fetch from endpoint that returns json
      try {
        const headers = { 'Content-Type': 'application/json' };
        const response = await apiRequest(FETCH_CONNECTED_DEVICES, { headers });
        if (response?.connectionAvailable) {
          setConnectedDevices(response.devices);
          setConnectionAvailable(true);
        }
      } catch (err) {
        // console.error('getConnectedDevices error:', err);
      } finally {
        setHasLoaded(true);
      }
    };
    getConnectedDevices();
  }, []);
  // run if updates to successAlert, failureAlert states
  useEffect(() => {
    const handleRedirectQueryParams = () => {
      const resUrl = new URL(window.location);
      resUrl.searchParams.forEach((status, vendor) => {
        showAlert(vendor, status);
      });
    };
    handleRedirectQueryParams();
  }, [
    successAlert,
    failureAlert,
    disconnectSuccessAlert,
    disconnectFailureAlert,
  ]);

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
      <div data-testid="devices-to-connect-section">
        <DevicesToConnectSection
          connectedDevices={connectedDevices}
          connectionAvailable={connectionAvailable}
          hasLoaded={hasLoaded}
        />
      </div>
    </>
  );
};
