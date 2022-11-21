import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

const CannotEditModal = props => {
  const { activeSection, isVisible, onHide } = props;
  return (
    <Modal
      title={`Save or cancel your edits to your ${activeSection}`}
      status="warning"
      visible={isVisible}
      onClose={onHide}
    >
      <p>
        Before you can edit a new section of your profile, you need to save or
        cancel your edits to your {activeSection}. If you cancel, we won’t save
        your in-progress edits.
      </p>
      <button onClick={onHide}>OK</button>
    </Modal>
  );
};

CannotEditModal.propTypes = {
  activeSection: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default CannotEditModal;
