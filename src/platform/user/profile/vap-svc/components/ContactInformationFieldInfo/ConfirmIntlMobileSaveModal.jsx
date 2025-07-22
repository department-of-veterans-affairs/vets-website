import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ConfirmIntlMobileSaveModal = ({
  isVisible,
  onConfirm,
  onCancel,
  countryCode,
  phoneNumber,
}) => {
  return (
    <VaModal
      data-testid="confirm-international-mobile-save-modal"
      modalTitle="We can’t send text notifications to international phone numbers"
      onCloseEvent={onCancel}
      primaryButtonText="Save the number you entered"
      onPrimaryButtonClick={() => {
        onConfirm();
      }}
      secondaryButtonText="Edit the number you entered"
      onSecondaryButtonClick={() => {
        onCancel();
      }}
      status="warning"
      visible={isVisible}
    >
      <p />
      <p>
        <va-telephone contact={phoneNumber} country-code={countryCode} /> is an
        international phone number. If you save this number, you won’t receive
        text notifications
      </p>
    </VaModal>
  );
};

ConfirmIntlMobileSaveModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  countryCode: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
};

export default ConfirmIntlMobileSaveModal;
