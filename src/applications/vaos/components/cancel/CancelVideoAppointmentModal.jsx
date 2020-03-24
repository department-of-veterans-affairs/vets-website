import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function CancelVideoAppointmentModal({ onClose, facility }) {
  return (
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      title="You need to call your VA medical center to cancel this appointment"
    >
      VA Video Connect appointments can’t be canceled online. Please call the
      below VA facility to cancel your appointment.
      <p className="vads-u-margin-top--2">
        {facility ? (
          <>
            {facility.name}
            <br />
          </>
        ) : null}
        {facility?.phone?.main && (
          <dl className="vads-u-margin-y--0">
            <dt className="vads-u-display--inline">
              <strong>Main phone:</strong>
            </dt>{' '}
            <dd className="vads-u-display--inline">
              <a href={`tel:${facility.phone.main.replace(/[^0-9]/g, '')}`}>
                {facility.phone.main}
              </a>
            </dd>
          </dl>
        )}
      </p>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
