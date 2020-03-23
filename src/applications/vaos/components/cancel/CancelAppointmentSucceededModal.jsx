import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function CancelAppointmentSucceededModal({ onClose }) {
  return (
    <Modal
      id="cancelAppt"
      status="success"
      visible
      onClose={onClose}
      title="Your appointment has been canceled"
    >
      We’ve let your provider know you canceled this appointment.
      <p className="vads-u-margin-top--2">
        <button onClick={onClose}>Continue</button>
      </p>
    </Modal>
  );
}
