import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

const ConfirmCancelModal = props => {
  const { activeSection, closeModal, onHide, isVisible } = props;

  return (
    <Modal
      title="Are you sure?"
      status="warning"
      visible={isVisible}
      onClose={onHide}
    >
      <p>
        {`You haven’t finished editing your ${activeSection}. If you cancel, your in-progress work won’t be saved.`}
      </p>
      <button
        className="usa-button-secondary"
        onClick={() => {
          onHide();
        }}
      >
        Continue Editing
      </button>
      <button
        onClick={() => {
          onHide();
          closeModal();
        }}
      >
        Cancel
      </button>
    </Modal>
  );
};

ConfirmCancelModal.propTypes = {
  activeSection: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default ConfirmCancelModal;
