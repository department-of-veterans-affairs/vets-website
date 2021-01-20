import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

const PodiatryAppointmentUnavailableModal = ({ onClose, showModal }) => {
  if (!showModal) {
    return null;
  }
  const title = 'You need to call your VA facility for a Podiatry appointment';

  return (
    <Modal
      id="toc-modal"
      status="warning"
      visible
      onClose={onClose}
      title={title}
    >
      You’re not eligible to request a community care Podiatry appointment
      online at this time. Please call your local VA medical center to schedule
      this appointment.
      <br />
      <a target="_blank" rel="noopener noreferrer" href="/find-locations">
        Find your VA health facility’s phone number
      </a>
      <button
        onClick={onClose}
        className="vads-u-display--block vads-u-margin-top--2p5"
      >
        Ok
      </button>
    </Modal>
  );
};

PodiatryAppointmentUnavailableModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
};

export default PodiatryAppointmentUnavailableModal;
