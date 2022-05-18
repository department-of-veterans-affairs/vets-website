import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

export const DisconnectModal = ({ deviceName }) => {
  return (
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
          Disconnecting your {deviceName} will stop sharing data with the VA.
        </p>
      </VaModal>
    </>
  );
};

DisconnectModal.propTypes = {
  deviceName: PropTypes.string.isRequired,
};
