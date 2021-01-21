import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

const CannotEditModal = props => {
  const { activeSection, isVisible, onHide } = props;
  return (
    <Modal
      title={`You’re currently editing your ${activeSection}`}
      status="warning"
      visible={isVisible}
      onClose={onHide}
    >
      <p>
        Please go back and save or cancel your work before editing a new section
        of your profile. If you cancel, your in-progress work won’t be saved.
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
