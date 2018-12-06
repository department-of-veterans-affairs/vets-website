import React from 'react';

import Modal from '@department-of-veterans-affairs/formation/Modal';

export function AccountModal({
  appName,
  modalOpen,
  onCloseModal,
  onConfirmDelete,
  propertyName,
}) {
  return (
    <Modal
      clickToClose
      cssClass="va-modal"
      id="disconnect-alert"
      onClose={onCloseModal}
      title={`Are you sure you want to disconnect from ${appName}?`}
      visible={modalOpen}
    >
      <p>
        {appName} will no longer be able to access your {propertyName} account
        informaton. You cannot undo this action.
      </p>
      <button className="usa-button-primary" onClick={onConfirmDelete}>
        Confirm
      </button>
      <button className="usa-button-secondary" onClick={onCloseModal}>
        Cancel
      </button>
    </Modal>
  );
}
