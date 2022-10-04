import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const ConfirmCancelModal = props => {
  const { activeSection, closeModal, onHide, isVisible } = props;

  return (
    <VaModal
      modalTitle="Are you sure?"
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
    >
      <p>
        {`You haven't finished editing and saving the changes to your ${activeSection}. If you cancel now, we won't save your changes.`}
      </p>
      <button
        type="button"
        className="usa-button-primary"
        onClick={() => {
          onHide();
        }}
      >
        Continue Editing
      </button>
      <button
        type="button"
        className="usa-button-secondary"
        onClick={() => {
          onHide();
          closeModal();
        }}
      >
        Cancel
      </button>
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
