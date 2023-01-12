import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DeleteDraftModal = props => {
  return (
    <VaModal
      id="delete-draft-modal"
      data-testid="delete-draft-modal"
      modalTitle={Prompts.Draft.DELETE_DRAFT_CONFIRM}
      onCloseEvent={props.onClose}
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Delete draft"
      secondaryButtonText="Cancel"
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {Prompts.Draft.DELETE_DRAFT_CONFIRM_NOTE}
      </p>
    </VaModal>
  );
};

DeleteDraftModal.propTypes = {
  id: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteDraftModal;
