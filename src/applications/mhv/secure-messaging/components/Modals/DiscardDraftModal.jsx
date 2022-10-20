import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DiscardDraftModal = props => {
  return (
    <VaModal
      id="discard-draft-modal"
      modalTitle={Prompts.Draft.DISCARD_DRAFT_CONFIRM}
      onCloseEvent={props.onClose}
      onPrimaryButtonClick={props.onDelete}
      onSecondaryButtonClick={props.onClose}
      primaryButtonText="Discard draft"
      secondaryButtonText="Cancel"
      visible={props.visible}
      status="warning"
    >
      {/* <p>{Prompts.Draft.DISCARD_DRAFT_CONFIRM_NOTE}</p> */}
      <p>Drafts are permanently deleted and this action can’t be undone.</p>
      <p>Deleting a draft won’t affect other messages in this conversation</p>
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
