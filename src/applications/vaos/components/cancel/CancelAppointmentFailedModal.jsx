import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

import FacilityAddress from '../FacilityAddress';

export default function CancelAppointmentFailedModal({
  appointment,
  facility,
  onClose,
}) {
  return (
    <Modal
      id="cancelAppt"
      status="error"
      visible
      onClose={onClose}
      title="We couldn’t cancel your appointment"
    >
      <p>
        Something went wrong when we tried to cancel this appointment. Please
        contact your medical center to cancel:
      </p>
      <p>
        {appointment.clinicName ? (
          <>
            {appointment.clinicName}
            <br />
          </>
        ) : null}
        {facility ? (
          <>
            <strong>{facility.name}</strong>
            <br />
          </>
        ) : null}
        {!!facility && <FacilityAddress facility={facility} />}
        {!facility && (
          <>
            <a target="_blank" rel="noopener noreferrer" href="/find-locations">
              Find facility contact information
            </a>
          </>
        )}
      </p>
    </Modal>
  );
}
