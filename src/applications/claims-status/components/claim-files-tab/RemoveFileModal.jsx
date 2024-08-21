import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

function RemoveFileModal({
  removeFileName,
  showRemoveFileModal,
  closeModal,
  removeFile,
}) {
  return (
    <VaModal
      id="remove-file"
      modalTitle="Remove this file?"
      onCloseEvent={() => {
        closeModal();
      }}
      onPrimaryButtonClick={() => {
        removeFile();
        closeModal();
      }}
      onSecondaryButtonClick={() => {
        closeModal();
      }}
      primaryButtonText="Yes, remove this"
      secondaryButtonText="No, keep this"
      visible={showRemoveFileModal}
      status="warning"
    >
      <p>
        We’ll remove{' '}
        <strong data-dd-privacy="mask" data-dd-action-name="file to be removed">
          {removeFileName}
        </strong>
      </p>
    </VaModal>
  );
}

RemoveFileModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  removeFile: PropTypes.func.isRequired,
  showRemoveFileModal: PropTypes.bool.isRequired,
  removeFileName: PropTypes.string,
};

export default RemoveFileModal;
