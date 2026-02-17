import React from 'react';
import PropTypes from 'prop-types';
import { datadogRum } from '@datadog/browser-rum';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { Prompts } from '../../util/constants';

const DeleteDraftModal = props => {
  const { draftSequence } = props;
  return (
    <VaModal
      id={`delete-draft-modal${draftSequence ? `-${draftSequence}` : ''}`}
      data-testid={`delete-draft-modal${
        draftSequence ? `-${draftSequence}` : ''
      }`}
      data-dd-action-name={`${Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER} Modal${
        draftSequence ? ` ${draftSequence}` : ''
      }`}
      modalTitle={Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER}
      onCloseEvent={() => {
        props.onClose();
        datadogRum.addAction(
          `${Prompts.Draft.DELETE_DRAFT_CONFIRM_HEADER} Modal${
            draftSequence ? ` ${draftSequence} Closed` : ' Closed'
          }`,
        );
      }}
      visible={props.visible}
      status="warning"
    >
      <p style={{ whiteSpace: 'pre-line' }}>
        {Prompts.Draft.DELETE_DRAFT_CONFIRM_CONTENT}
      </p>
      <div className="vads-u-display--flex vads-u-flex-direction--column mobile-lg:vads-u-flex-direction--row">
        <va-button
          id="delete-draft"
          data-testid="confirm-delete-draft"
          data-dd-action-name={`Confirm Delete Draft Button ${
            draftSequence ? ` ${draftSequence}` : ''
          }`}
          class="vads-u-padding-right--0 vads-u-padding-bottom--1p5 mobile-lg:vads-u-padding-right--2 mobile-lg:vads-u-padding-bottom--0"
          text="Delete draft"
          onClick={props.onDelete}
        />
        <va-button
          id="delete-cancel"
          data-testid="cancel-delete-draft"
          data-dd-action-name={`Cancel Delete Draft Button ${
            draftSequence ? ` ${draftSequence}` : ''
          }`}
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
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onDelete: PropTypes.func,
};

export default DeleteDraftModal;
