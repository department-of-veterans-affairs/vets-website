import React from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const RemoveAttachmentModal = props => {
  return (
    <VaModal
      id={`remove-attachment-modal${
        props.draftSequence ? `-${props.draftSequence}` : ''
      }`}
      data-testid={`remove-attachment-modal${
        props.draftSequence ? `-${props.draftSequence}` : ''
      }`}
      data-dd-action-name={`Remove Attachment Modal${
        props.draftSequence ? `-${props.draftSequence}` : ''
      }`}
      modalTitle={Prompts.Attachment.REMOVE_ATTACHMENT_TITLE}
      onCloseEvent={() => {
        props.onClose();
        datadogRum.addAction(
          `Remove Attachment Modal Closed${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`,
        );
      }}
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
        mobile-lg:vads-u-flex-direction--row"
      >
        <va-button
          data-testid={`confirm-remove-attachment-button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
          id={`confirm-remove-attachment-button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
          text="Remove"
          onClick={props.onDelete}
          data-dd-action-name={`Confirm Remove Attachment Button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
        />
        <va-button
          class="vads-u-margin-top--1 mobile-lg:vads-u-margin-top--0"
          data-testid={`cancel-remove-attachment-button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
          id={`cancel-remove-attachment-button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
          secondary
          text="Cancel"
          onClick={props.onClose}
          data-dd-action-name={`Cancel Remove Attachment Button${
            props.draftSequence ? `-${props.draftSequence}` : ''
          }`}
        />
      </div>
    </VaModal>
  );
};

RemoveAttachmentModal.propTypes = {
  draftSequence: PropTypes.number,
  id: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default RemoveAttachmentModal;
