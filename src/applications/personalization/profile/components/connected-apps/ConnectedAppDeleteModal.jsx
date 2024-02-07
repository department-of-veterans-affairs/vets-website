import React from 'react';
import PropTypes from 'prop-types';

import {
  VaModal,
  VaButton,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export function ConnectedAppDeleteModal({
  title,
  deleting,
  modalOpen,
  closeModal,
  confirmDelete,
}) {
  return (
    <VaModal
      clickToClose
      id="disconnect-alert"
      onCloseEvent={closeModal}
      modalTitle="Are you sure?"
      visible={modalOpen}
      status="warning"
      uswds
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
          <VaButton
            onClick={confirmDelete}
            data-testid={`confirm-disconnect-${title}`}
            text="Disconnect"
          />
          <VaButton
            secondary
            onClick={closeModal}
            text="No, cancel this change"
          />
        </>
      )}

      {deleting && <VaButton disabled text="Processing update..." />}
    </VaModal>
  );
}

ConnectedAppDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  deleting: PropTypes.bool,
};
