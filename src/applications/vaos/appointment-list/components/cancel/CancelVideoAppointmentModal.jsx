import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';

export default function CancelVideoAppointmentModal({ onClose, facility }) {
  const phone = facility?.telecom?.find(tele => tele.system === 'phone').value;
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
        {!!phone && (
          <>
            <h4 className="vaos-appts__block-label vads-u-display--inline">
              Main phone:
            </h4>{' '}
            <Telephone contact={phone} />
          </>
        )}
      </p>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
