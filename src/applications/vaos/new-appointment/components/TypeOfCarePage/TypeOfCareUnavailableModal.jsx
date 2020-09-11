import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

const TypeOfCareUnavailableModal = ({ onClose, showModal, typeOfCare }) => {
  if (!showModal) {
    return null;
  }

  return (
    <Modal
      id="toc-modal"
      status="warning"
      visible
      onClose={onClose}
      title={`You canʼt schedule a ${typeOfCare} appointment right now`}
    >
      At this time, {`${typeOfCare.toLowerCase()}`} appointments can only be
      scheduled online for Community Care appointments. To schedule a podiatry
      appointment at a VA facility, please call your local VA medical center, or
      use the{' '}
      <a target="_blank" rel="noopener noreferrer" href="/find-locations">
        locator tool to find your nearest VA medical facility
      </a>
      .
      <button
        onClick={onClose}
        className="vads-u-display--block vads-u-margin-top--2p5"
      >
        Ok
      </button>
    </Modal>
  );
};

TypeOfCareUnavailableModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  typeOfCare: PropTypes.string.isRequired,
};

export default TypeOfCareUnavailableModal;
