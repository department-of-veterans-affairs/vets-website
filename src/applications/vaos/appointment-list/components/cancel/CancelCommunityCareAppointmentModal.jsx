import React from 'react';
import Modal from '@department-of-veterans-affairs/formation-react/Modal';
import Telephone from '@department-of-veterans-affairs/formation-react/Telephone';

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
  const address = location.address;

  const title = location.address
    ? 'You need to call your community care provider to cancel this appointment'
    : 'You need to call your community care staff at your local VA facility to cancel this appointment';

  return (
    <Modal
      id="cancelAppt"
      status="warning"
      visible
      onClose={onClose}
      title={title}
    >
      Community care appointments can’t be canceled online.{' '}
      {!address && (
        <>
          Please contact your facility community care staff at{' '}
          <a href="/find-locations" target="_blank" rel="noopener noreferrer">
            your local VA.
          </a>
          <br />
        </>
      )}
      {!!address && (
        <>
          Please call the below provider to cancel your appointment.
          <br />
        </>
      )}
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
              <Telephone contact={phone} />
            </dd>
          </dl>
        )}
      </div>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
