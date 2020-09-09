import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';

export default function CancelCommunityCareAppointmentModal({
  onClose,
  appointment,
}) {
  const location = appointment.contained.find(
    res => res.resourceType === 'Location',
  );
  const practitionerName = appointment.participant?.find(res =>
    res.actor.reference.startsWith('Practitioner'),
  )?.actor.display;
  const phone = location.telecom?.find(item => item.system === 'phone')?.value;
  return (
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      title="You need to call your community care provider to cancel this appointment"
    >
      Community care appointments can’t be canceled online. Please call the
      below provider to cancel your appointment.
      <div className="vads-u-margin-y--2">
        {!!practitionerName && (
          <>
            {practitionerName}
            <br />
          </>
        )}
        <strong>{location.name}</strong>
        {!!phone && (
          <dl className="vads-u-margin-y--0">
            <dt className="vads-u-display--inline">
              <strong>Main phone:</strong>
            </dt>{' '}
            <dd className="vads-u-display--inline">
              <a href={`tel:${phone.replace(/[^0-9]/g, '')}`}>{phone}</a>
            </dd>
          </dl>
        )}
      </div>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
