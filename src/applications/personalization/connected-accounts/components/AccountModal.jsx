import React from 'react';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export function AccountModal({
  appName,
  modalOpen,
  onCloseModal,
  onConfirmDelete,
}) {
  return (
    <Modal
      clickToClose
      cssClass="va-modal"
      id="disconnect-alert"
      onClose={onCloseModal}
      title={`Please confirm you want to disconnect from ${appName}`}
      visible={modalOpen}
    >
      <p>
        {appName} won’t be able to access your profile data once you disconnect.
        You can’t undo this action.
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
