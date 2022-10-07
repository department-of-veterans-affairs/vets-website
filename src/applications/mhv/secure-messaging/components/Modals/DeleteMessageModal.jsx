import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DeleteMessageModal = props => {
  return (
    <VaModal
      id="delete-message-modal"
      modalTitle={Prompts.Message.DELETE_MESSAGE_CONFIRM}
      onCloseEvent={props.onClose}
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Confirm"
      secondaryButtonText="Cancel"
      visible={props.visible}
      status="warning"
    >
      <div className="modal-body vads-u-padding-bottom--1p5">
        <p>{Prompts.Message.DELETE_MESSAGE_CONFIRM_NOTE}</p>
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
