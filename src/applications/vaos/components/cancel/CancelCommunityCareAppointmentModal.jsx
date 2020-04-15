import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function CancelCommunityCareAppointmentModal({
  onClose,
  appointment,
}) {
  const hasName =
    !!appointment.providerName?.firstName &&
    !!appointment.providerName?.lastName;
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
        {hasName && (
          <>
            {appointment.providerName.firstName}{' '}
            {appointment.providerName.lastName}
            <br />
          </>
        )}
        <strong>{appointment.providerPractice}</strong>
        {appointment.providerPhone && (
          <dl className="vads-u-margin-y--0">
            <dt className="vads-u-display--inline">
              <strong>Main phone:</strong>
            </dt>{' '}
            <dd className="vads-u-display--inline">
              <a
                href={`tel:${appointment.providerPhone.replace(/[^0-9]/g, '')}`}
              >
                {appointment.providerPhone}
              </a>
            </dd>
          </dl>
        )}
      </div>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
