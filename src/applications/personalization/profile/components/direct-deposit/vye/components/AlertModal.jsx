import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';
import React from 'react';

const AlertModal = ({ showModal, cancelEditClick, setShowModal, formType }) => {
  return (
    <VaModal
      visible={showModal}
      modalTitle="Are you sure?"
      onCloseEvent={() => {
        setShowModal(false);
      }}
      onPrimaryButtonClick={cancelEditClick}
      onSecondaryButtonClick={() => {
        setShowModal(false);
      }}
      primaryButtonText="Yes, cancel my changes"
      secondaryButtonText="No, go back to editing"
      id="vye-alert-btn"
      status="warning"
    >
      <p>
        You haven’t finished editing and saving the changes to your {formType}.
        If you cancel now, we won’t save your changes.
      </p>
    </VaModal>
  );
};

AlertModal.propTypes = {
  cancelEditClick: PropTypes.func,
  formType: PropTypes.string,
  setShowModal: PropTypes.func,
  showModal: PropTypes.bool,
};
export default AlertModal;
