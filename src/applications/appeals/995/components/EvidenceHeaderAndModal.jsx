import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const EvidenceHeaderAndModal = ({
  currentData,
  currentState,
  currentIndex,
  addOrEdit,
  content,
  handlers,
}) => (
  <>
    <legend id="evidence-title" className="vads-u-font-family--serif">
      <h3 name="topPageElement" className="vads-u-margin--0">
        {content.title(addOrEdit, currentIndex + 1)}
      </h3>
    </legend>
    <p>{content.description}</p>
    <VaModal
      clickToClose
      status="info"
      modalTitle={content.modal.title(currentData)}
      primaryButtonText={content.modal.yes}
      secondaryButtonText={content.modal.no}
      onCloseEvent={handlers.onModalClose}
      onPrimaryButtonClick={handlers.onModalYes}
      onSecondaryButtonClick={handlers.onModalNo}
      visible={currentState.showModal}
    >
      <p>{content.modal.description}</p>
    </VaModal>
  </>
);

EvidenceHeaderAndModal.propTypes = {
  addOrEdit: PropTypes.string,
  content: PropTypes.shape({
    title: PropTypes.func,
    description: PropTypes.string,
    modal: PropTypes.shape({
      description: PropTypes.string,
      no: PropTypes.string,
      title: PropTypes.func,
      yes: PropTypes.string,
    }),
  }),
  currentData: PropTypes.shape({}),
  currentIndex: PropTypes.number,
  currentState: PropTypes.shape({
    showModal: PropTypes.bool,
  }),
  handlers: PropTypes.shape({
    onModalClose: PropTypes.func,
    onModalNo: PropTypes.func,
    onModalYes: PropTypes.func,
  }),
};
