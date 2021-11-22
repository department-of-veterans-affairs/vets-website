import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';

export default function CancelAppointmentSucceededModal({
  isConfirmed,
  onClose,
}) {
  const typeText = isConfirmed ? 'appointment' : 'request';
  return (
    <Modal
      id="cancelAppt"
      status="success"
      visible
      onClose={onClose}
      title={`Your ${typeText} has been canceled`}
    >
      We’ve let your provider know you canceled this {typeText}.
      <p className="vads-u-margin-top--2">
        <button onClick={onClose}>Continue</button>
      </p>
    </Modal>
  );
}
