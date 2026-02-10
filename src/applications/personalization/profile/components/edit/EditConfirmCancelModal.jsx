import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

import { EditContext } from './EditContext';

export const EditConfirmCancelModal = props => {
  const { activeSection, onHide, isVisible } = props;

  const { onCancel } = useContext(EditContext);

  // return null to avoid even having the web component in dom
  // when not needed (this makes testing easier as well)
  if (!isVisible) {
    return null;
  }

  const handlers = {
    primary: () => {
      onCancel();
    },
    secondary: () => onHide(),
  };

  return (
    <VaModal
      modalTitle="Cancel changes?"
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
      onPrimaryButtonClick={handlers.primary}
      onSecondaryButtonClick={handlers.secondary}
      primaryButtonText="Cancel changes"
      secondaryButtonText="Keep editing"
      data-testid="edit-confirm-cancel-modal"
      uswds
    >
      <p>
        {`You haven't saved the changes you made to your ${activeSection}. If you cancel, we won't save your changes.`}
      </p>
    </VaModal>
  );
};

EditConfirmCancelModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  activeSection: PropTypes.string,
};
