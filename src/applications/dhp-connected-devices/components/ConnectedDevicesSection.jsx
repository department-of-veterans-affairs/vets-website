import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
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
  const [modalVisible, setModalVisible] = useState(false);
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
              onClickHandler={() => setModalVisible(true)}
            />
          );
        }
        return <></>;
      });
    } catch (err) {
      return (
        <p data-testid="no-devices-connected-alert">
          You do not have any devices connected.
        </p>
      );
    }
  };

  return (
    <>
      {modalVisible && (
        <>
          <VaModal
            id="disconnect-modal"
            modalTitle="Disconnect device"
            onCloseEvent={function noRefCheck() {}}
            onPrimaryButtonClick={function noRefCheck() {}}
            onSecondaryButtonClick={function noRefCheck() {}}
            primaryButtonText="Disconnect device"
            secondaryButtonText="Go back"
            data-testid="disconnect-modal"
            visible
          >
            <p>
              Disconnecting your Apple Watch will stop sharing data with the VA.
            </p>
          </VaModal>
        </>
      )}
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
