import React from 'react';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import PropTypes from 'prop-types';

const UnsavedChangesModal = ({
  visible,
  onCloseEvent,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
}) => {
  return (
    <VaModal
      modalTitle="Leave page?"
      onCloseEvent={onCloseEvent}
      onPrimaryButtonClick={onPrimaryButtonClick}
      onSecondaryButtonClick={onSecondaryButtonClick}
      primaryButtonText="Cancel"
      secondaryButtonText="Leave page"
      status="warning"
      visible={visible}
    >
      <p>If you leave, you’ll lose any changes you made to this expense.</p>
    </VaModal>
  );
};

UnsavedChangesModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCloseEvent: PropTypes.func.isRequired,
  onPrimaryButtonClick: PropTypes.func.isRequired,
  onSecondaryButtonClick: PropTypes.func.isRequired,
};

export default UnsavedChangesModal;
