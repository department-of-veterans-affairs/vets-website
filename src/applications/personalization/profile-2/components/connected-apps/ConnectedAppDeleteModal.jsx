import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export function ConnectedAppDeleteModal({
  title,
  deleting,
  modalOpen,
  closeModal,
  confirmDelete,
}) {
  return (
    <Modal
      clickToClose
      cssClass="va-modal"
      id="disconnect-alert"
      onClose={closeModal}
      title="Do you want to disconnect this app?"
      visible={modalOpen}
    >
      <p>
        {title} won’t have access to new information about you from VA once you
        disconnect. This may impact the usefulness of the app.
      </p>

      {!deleting && (
        <>
          <button className="usa-button-secondary" onClick={closeModal}>
            Cancel
          </button>

          <button className="usa-button-primary" onClick={confirmDelete}>
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

ConnectedAppDeleteModal.propTypes = {
  title: PropTypes.string.isRequired,
  deleting: PropTypes.bool,
  modalOpen: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
};
