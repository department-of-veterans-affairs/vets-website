import React from 'react';
import PropTypes from 'prop-types';

import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

export const ConnectedAppDeleteModal = ({
  modalOpen,
  closeModal,
  confirmDelete,
}) => {
  return modalOpen ? (
    <VaModal
      clickToClose
      onCloseEvent={closeModal}
      modalTitle="Disconnect app?"
      visible={modalOpen}
      status="warning"
      onPrimaryButtonClick={confirmDelete}
      onSecondaryButtonClick={closeModal}
      primaryButtonText="Disconnect app"
      secondaryButtonText="Cancel change"
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
    </VaModal>
  ) : null;
};

ConnectedAppDeleteModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
};
