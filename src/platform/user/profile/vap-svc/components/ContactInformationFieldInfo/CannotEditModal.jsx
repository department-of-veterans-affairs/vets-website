import React from 'react';
import PropTypes from 'prop-types';
import { VaModal } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const CannotEditModal = props => {
  const { activeSection, isVisible, onHide } = props;
  return (
    <VaModal
      modalTitle={`Save or cancel your edits to your ${activeSection}`}
      status="warning"
      visible={isVisible}
      onCloseEvent={onHide}
      primaryButtonText="OK"
      onPrimaryButtonClick={onHide}
    >
      <p>
        Before you can edit a new section of your profile, you need to save or
        cancel your edits to your {activeSection}. If you cancel, we won’t save
        your in-progress edits.
      </p>
    </VaModal>
  );
};

CannotEditModal.propTypes = {
  activeSection: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default CannotEditModal;
