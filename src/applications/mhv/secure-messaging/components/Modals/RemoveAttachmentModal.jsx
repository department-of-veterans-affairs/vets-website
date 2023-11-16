import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const RemoveAttachmentModal = props => {
  return (
    <VaModal
      id="remove-attachment-modal"
      data-testid="remove-attachment-modal"
      modalTitle={Prompts.Attachment.REMOVE_ATTACHMENT_TITLE}
      onCloseEvent={props.onClose}
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT}
      </p>

      <div
        className="remove-attachment-modal-buttons
        vads-u-display--flex
        vads-u-flex-direction--column
        small-screen:vads-u-flex-direction--row"
      >
        <va-button
          data-testid="confirm-remove-attachment-button"
          text="Remove"
          onClick={props.onDelete}
        />
        <va-button
          data-testid="cancel-remove-attachment-button"
          secondary
          text="Cancel"
          onClick={props.onClose}
        />
      </div>
    </VaModal>
  );
};

RemoveAttachmentModal.propTypes = {
  id: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default RemoveAttachmentModal;
