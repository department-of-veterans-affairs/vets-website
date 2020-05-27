import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function CancelCommunityCareAppointmentModal({
  onClose,
  appointment,
}) {
  const name = appointment.participant?.[0]?.actor?.display;
  const contactInfo = appointment.contained?.[0]?.actor;
  return (
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      title="You need to call your provider to cancel this appointment"
    >
      Community Care appointments can’t be canceled online. Please call the
      below provider to cancel your appointment.
      <div className="vads-u-margin-y--2">
        {!!name && (
          <>
            {appointment.participant?.[0]?.actor?.display}
            <br />
          </>
        )}
        <strong>{contactInfo?.name}</strong>
        {contactInfo?.telecom?.[0]?.value && (
          <dl className="vads-u-margin-y--0">
            <dt className="vads-u-display--inline">
              <strong>Main phone:</strong>
            </dt>{' '}
            <dd className="vads-u-display--inline">
              <a
                href={`tel:${contactInfo?.telecom?.[0]?.value.replace(
                  /[^0-9]/g,
                  '',
                )}`}
              >
                {contactInfo?.telecom?.[0]?.value}
              </a>
            </dd>
          </dl>
        )}
      </div>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
