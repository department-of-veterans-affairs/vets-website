import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@department-of-veterans-affairs/component-library/Modal';

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
      title="Are you sure?"
      visible={modalOpen}
      status="warning"
    >
      <p>
        After you disconnect this app, the app won’t have access to new
        information from your VA.gov profile. This may affect how useful the app
        is to you.
      </p>
      <p>
        Some apps might store information you’ve already shared after you
        disconnect. If you want your stored information deleted from the app,
        contact the app’s customer support.
      </p>

      {!deleting && (
        <>
          <button
            className="usa-button-primary"
            onClick={confirmDelete}
            data-testid={`confirm-disconnect-${title}`}
          >
            Disconnect
          </button>
          <button className="usa-button-secondary" onClick={closeModal}>
            No, cancel this change
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
