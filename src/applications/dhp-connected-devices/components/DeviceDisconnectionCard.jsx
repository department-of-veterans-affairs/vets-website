import React, { useState } from 'react';
import PropTypes from 'prop-types';
import environment from 'platform/utilities/environment';
import { DisconnectModal } from './DisconnectModal';
import { TermsAndConditions } from './TermsAndConditions';

export const DeviceDisconnectionCard = ({ device }) => {
  const [modalVisible, setModalVisible] = useState(false);

  function closeModal() {
    setModalVisible(false);
  }

  function disconnectDevice() {
    closeModal();
    window.location.href = `${environment.API_URL}/dhp_connected_devices${device.disconnectUrl}`;
  }

  return (
    <>
      {modalVisible && (
        <DisconnectModal
          deviceName={device.name}
          handleClose={closeModal}
          handleDisconnect={disconnectDevice}
        />
      )}
      <div className="connect-device">
        <h3 className="vads-u-margin-y--0">
          {device.name}{' '}
          <span className="connected-header-text"> - Connected</span>{' '}
        </h3>
        <TermsAndConditions device={device} />
        <p className="vads-u-margin-y--0">
          <button
            type="button"
            onClick={() => setModalVisible(true)}
            data-testid={`${device.key}-disconnect-link`}
            id={`${device.key}-disconnect-link`}
            className="usa-button-secondary"
            aria-label={`Disconnect ${device.name}`}
          >
            Disconnect
          </button>
        </p>
      </div>
    </>
  );
};

DeviceDisconnectionCard.propTypes = {
  device: PropTypes.object.isRequired,
};
