import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DiscardDraftModal = props => {
  return (
    <VaModal
      id="discard-draft-modal"
      data-testid="discard-draft-modal"
      modalTitle={Prompts.Draft.DISCARD_DRAFT_CONFIRM}
      onCloseEvent={props.onClose}
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Discard draft"
      secondaryButtonText="Cancel"
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {Prompts.Draft.DISCARD_DRAFT_CONFIRM_NOTE}
      </p>
    </VaModal>
  );
};

DiscardDraftModal.propTypes = {
  id: PropTypes.number,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DiscardDraftModal;
