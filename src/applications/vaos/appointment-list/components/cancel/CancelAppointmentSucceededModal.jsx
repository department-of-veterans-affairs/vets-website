import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function CancelAppointmentSucceededModal({
  isConfirmed,
  onClose,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <>
      <Modal
        id="cancelAppt"
        status="success"
        visible
        onClose={onClose}
        title={`Your ${typeText} has been canceled`}
      >
        {isConfirmed
          ? `If you want to reschedule, call us or schedule a new ${typeText} online.`
          : `If you still need an appointment, call us or request a new appointment online.`}
        <p className="vads-u-margin-top--2">
          <button type="button" onClick={onClose}>
            Continue
          </button>
        </p>
      </Modal>
    </>
  );
}

CancelAppointmentSucceededModal.propTypes = {
  isConfirmed: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
