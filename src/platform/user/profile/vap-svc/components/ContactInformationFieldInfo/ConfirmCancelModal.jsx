import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ConfirmCancelModal = props => {
  const { activeSection, closeModal, onHide, isVisible } = props;

  // return null to avoid even having the web component in dom
  // when not needed (this makes testing easier as well)
  if (!isVisible) {
    return null;
  }

  const handlers = {
    primary: () => {
      onHide();
      closeModal();
    },
    secondary: () => onHide(),
  };

  return (
    <VaModal
      modalTitle="Are you sure?"
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
      onPrimaryButtonClick={handlers.primary}
      onSecondaryButtonClick={handlers.secondary}
      primaryButtonText="Yes, cancel my changes"
      secondaryButtonText="No, go back to editing"
      data-testid="confirm-cancel-modal"
      uswds
    >
      <p className="vads-u-margin-bottom--0">
        {`You haven't finished editing and saving the changes to your ${activeSection}. If you cancel now, we won't save your changes.`}
      </p>
    </VaModal>
  );
};

ConfirmCancelModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  activeSection: PropTypes.string,
};

export default ConfirmCancelModal;
