import React from 'react';
import Modal from '@department-of-veterans-affairs/component-library/Modal';
import Telephone from '@department-of-veterans-affairs/component-library/Telephone';
import NewTabAnchor from '../../../components/NewTabAnchor';

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
          <NewTabAnchor href="/find-locations">your local VA.</NewTabAnchor>
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
          <>
            <h4 className="vaos-appts__block-label vads-u-display--inline">
              Main phone:
            </h4>{' '}
            <Telephone contact={phone} />
          </>
        )}
      </div>
      <button onClick={onClose}>OK</button>
    </Modal>
  );
}
