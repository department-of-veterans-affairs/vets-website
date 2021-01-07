import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

const ConfirmCancelModal = props => {
  const {
    activeSection,
    closeModal,
    hideConfirmCancelModal,
    showConfirmCancelModal,
  } = props;

  return (
    <Modal
      title="Are you sure?"
      status="warning"
      visible={showConfirmCancelModal}
      onClose={hideConfirmCancelModal}
    >
      <p>
        {`You haven’t finished editing your ${activeSection}. If you cancel, your in-progress work won’t be saved.`}
      </p>
      <button
        className="usa-button-secondary"
        onClick={() => {
          hideConfirmCancelModal();
        }}
      >
        Continue Editing
      </button>
      <button
        onClick={() => {
          hideConfirmCancelModal();
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
  showConfirmCancelModal: PropTypes.bool.isRequired,
  hideConfirmCancelModal: PropTypes.func.isRequired,
};

export default ConfirmCancelModal;
