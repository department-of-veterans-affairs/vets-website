import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DeleteDraftModal = props => {
  const { unsavedDraft, draftSequence } = props;
  return (
    <VaModal
      id={`delete-draft-modal${draftSequence ? `-${draftSequence}` : ''}`}
      data-testid={`delete-draft-modal${
        draftSequence ? `-${draftSequence}` : ''
      }`}
      modalTitle={
        unsavedDraft
          ? Prompts.Draft.DELETE_NEW_DRAFT_TITLE
          : Prompts.Draft.DELETE_DRAFT_CONFIRM
      }
      onCloseEvent={props.onClose}
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {unsavedDraft
          ? Prompts.Draft.DELETE_NEW_DRAFT_CONTENT
          : Prompts.Draft.DELETE_DRAFT_CONFIRM_NOTE}
      </p>
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <va-button
          id="delete-draft"
          data-testid="confirm-delete-draft"
          class="vads-u-padding-right--0 vads-u-padding-bottom--1p5 small-screen:vads-u-padding-right--2 small-screen:vads-u-padding-bottom--0"
          text="Delete draft"
          onClick={props.onDelete}
        />
        <va-button
          id="delete-cancel"
          data-testid="cancel-delete-draft"
          secondary
          text="Cancel"
          onClick={props.onClose}
        />
      </div>
    </VaModal>
  );
};

DeleteDraftModal.propTypes = {
  draftSequence: PropTypes.number,
  id: PropTypes.number,
  unsavedDraft: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteDraftModal;
