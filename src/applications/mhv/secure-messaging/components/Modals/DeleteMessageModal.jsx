import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const DeleteMessageModal = props => {
  return (
    <VaModal
      id="delete-message-modal"
      modalTitle="Are you sure you want to remove this message?"
      onCloseEvent={props.onClose}
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Confirm"
      secondaryButtonText="Cancel"
      visible={props.visible}
    >
      <div className="modal-body vads-u-padding-bottom--1p5">
        <p>
          This message will be moved to your Trash folder. Messages will not be
          permanently deleted.
        </p>
      </div>
    </VaModal>
  );
};

DeleteMessageModal.propTypes = {
  id: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteMessageModal;
