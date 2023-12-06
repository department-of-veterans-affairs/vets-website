import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

/**
 * A shared delete confirmation modal component.
 * @param {object} props - The props object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open.
 * @param {Function} props.onClose - Callback function to close the modal.
 * @param {Function} props.onDelete - Callback function to confirm deletion.
 * @param {string} props.modalTitle - The name of the modal to be deleted.
 */
const DeleteConfirmationModal = ({ isOpen, onClose, onDelete, modalTitle }) => {
  return (
    <VaModal
      onCloseEvent={onClose}
      modalTitle={`Delete ${modalTitle}?`}
      onPrimaryButtonClick={onDelete}
      onSecondaryButtonClick={onClose}
      primaryButtonText="Yes, delete this"
      secondaryButtonText="Cancel"
      status="warning"
      visible={isOpen}
      uswds
    />
  );
};

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  modalTitle: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DeleteConfirmationModal;
