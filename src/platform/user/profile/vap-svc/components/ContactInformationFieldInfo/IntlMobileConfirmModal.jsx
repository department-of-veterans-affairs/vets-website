import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { closeIntlMobileConfirmModal } from '@@vap-svc/actions';

const IntlMobileConfirmModal = ({
  isOpen,
  closeIntlMobileConfirmModal: closeModal,
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

IntlMobileConfirmModal.propTypes = {
  closeIntlMobileConfirmModal: PropTypes.func.isRequired,
  confirmFn: PropTypes.func,
  countryCode: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  phoneNumber: PropTypes.string,
};

export const mapStateToProps = state => state.vapService.intlMobileConfirmModal;

const mapDispatchToProps = {
  closeIntlMobileConfirmModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(IntlMobileConfirmModal);
