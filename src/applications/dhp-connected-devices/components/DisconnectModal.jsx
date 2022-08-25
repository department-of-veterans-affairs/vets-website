import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

export const DisconnectModal = ({
  deviceName,
  handleClose,
  handleDisconnect,
}) => {
  return (
    <>
      <VaModal
        id="disconnect-modal"
        modalTitle="Disconnect device"
        onCloseEvent={handleClose}
        onPrimaryButtonClick={handleDisconnect}
        onSecondaryButtonClick={handleClose}
        primaryButtonText="Disconnect device"
        secondaryButtonText="Cancel"
        data-testid="disconnect-modal"
        visible
      >
        <p>
          Disconnecting your {deviceName} will stop sharing data with the VA.
        </p>
      </VaModal>
    </>
  );
};

DisconnectModal.propTypes = {
  deviceName: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDisconnect: PropTypes.func.isRequired,
};
