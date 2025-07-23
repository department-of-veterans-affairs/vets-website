import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { closeConfirmIntlMobileSaveModal } from '@@vap-svc/actions';

const ConfirmIntlMobileSaveModal = ({
  isOpen,
  closeConfirmIntlMobileSaveModal: closeModal,
  countryCode,
  phoneNumber,
  confirmFn,
}) => {
  return (
    <VaModal
      data-testid="confirm-international-mobile-save-modal"
      modalTitle="We can’t send text notifications to international phone numbers"
      onCloseEvent={() => closeModal()}
      primaryButtonText="Save the number you entered"
      onPrimaryButtonClick={() => {
        closeModal();
        confirmFn();
      }}
      secondaryButtonText="Edit the number you entered"
      onSecondaryButtonClick={() => closeModal()}
      status="warning"
      visible={isOpen}
    >
      <p>
        <va-telephone contact={phoneNumber} country-code={countryCode} /> is an
        international phone number. If you save this number, you won’t receive
        text notifications
      </p>
    </VaModal>
  );
};

ConfirmIntlMobileSaveModal.propTypes = {
  closeConfirmIntlMobileSaveModal: PropTypes.func.isRequired,
  confirmFn: PropTypes.func,
  countryCode: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  phoneNumber: PropTypes.string,
};

export const mapStateToProps = state =>
  state.vapService.confirmIntlMobileSaveModal;

const mapDispatchToProps = {
  closeConfirmIntlMobileSaveModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConfirmIntlMobileSaveModal);
