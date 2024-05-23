import React from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export function ConnectedAppDeleteModal({
  title,
  deleting,
  modalOpen,
  closeModal,
  confirmDelete,
}) {
  return modalOpen ? (
    <VaModal
      clickToClose
      onCloseEvent={closeModal}
      modalTitle="Disconnect app?"
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
          <va-button
            onClick={confirmDelete}
            data-testid={`confirm-disconnect-${title}`}
            text="Disconnect"
            class="vads-u-width--full small-screen:vads-u-width--auto vads-u-margin-bottom--2 small-screen:vads-u-margin-bottom--0"
          />
          <va-button
            secondary
            onClick={closeModal}
            text="No, cancel this change"
            class="vads-u-width--full small-screen:vads-u-width--auto"
          />
        </>
      )}

      {deleting && (
        <va-button
          disabled
          text="Processing update..."
          class="vads-u-width--full small-screen:vads-u-width--auto"
        />
      )}
    </VaModal>
  ) : null;
}

ConnectedAppDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  deleting: PropTypes.bool,
};
