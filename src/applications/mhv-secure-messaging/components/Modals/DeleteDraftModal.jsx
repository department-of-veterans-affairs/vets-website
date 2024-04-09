import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DeleteDraftModal = props => {
  const { unsavedNewDraft } = props;
  return (
    <VaModal
      id="delete-draft-modal"
      data-testid="delete-draft-modal"
      modalTitle={
        unsavedNewDraft
          ? Prompts.Draft.DELETE_NEW_DRAFT_TITLE
          : Prompts.Draft.DELETE_DRAFT_CONFIRM
      }
      onCloseEvent={props.onClose}
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {unsavedNewDraft
          ? Prompts.Draft.DELETE_NEW_DRAFT_CONTENT
          : Prompts.Draft.DELETE_DRAFT_CONFIRM_NOTE}
      </p>
      <div className="vads-u-display--flex vads-u-flex-direction--column small-screen:vads-u-flex-direction--row">
        <va-button
          id="delete-draft"
          class="vads-u-padding-right--0 vads-u-padding-bottom--1p5 small-screen:vads-u-padding-right--2 small-screen:vads-u-padding-bottom--0"
          text="Delete draft"
          onClick={props.onDelete}
        />
        <va-button
          id="delete-cancel"
          secondary
          text="Cancel"
          onClick={props.onClose}
        />
      </div>
    </VaModal>
  );
};

DeleteDraftModal.propTypes = {
  id: PropTypes.number,
  unsavedNewDraft: PropTypes.bool,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteDraftModal;
