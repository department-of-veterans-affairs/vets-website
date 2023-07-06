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
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Remove"
      secondaryButtonText="Cancel"
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {Prompts.Attachment.REMOVE_ATTACHMENT_CONTENT}
      </p>
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
