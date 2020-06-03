import React from 'react';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export function ConnectedAppDeleteModal({
  appName,
  deleting,
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
      title="Do you want to disconnect this app?"
      visible={modalOpen}
    >
      <p>
        {appName} won’t have access to new information about you from VA once
        you disconnect. This may impact the usefulness of the app.
      </p>

      {!deleting && (
        <>
          <button className="usa-button-secondary" onClick={onCloseModal}>
            Cancel
          </button>

          <button className="usa-button-primary" onClick={onConfirmDelete}>
            Disconnect
          </button>
        </>
      )}

      {deleting && (
        <button className="usa-button-primary" disabled>
          Processing update...
        </button>
      )}
    </Modal>
  );
}
