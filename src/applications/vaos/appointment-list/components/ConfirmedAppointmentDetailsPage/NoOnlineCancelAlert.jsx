import React from 'react';
import FacilityPhone from '../../../components/FacilityPhone';
import InfoAlert from '../../../components/InfoAlert';
import { getFacilityPhone } from '../../../services/location';
import { APPOINTMENT_STATUS } from '../../../utils/constants';

export default function NoOnlineCancelAlert({ appointment, facility }) {
  const canceled = appointment.status === APPOINTMENT_STATUS.cancelled;
  const isPastAppointment = appointment.vaos.isPastAppointment;

  if (canceled || isPastAppointment) {
    return null;
  }

  const name = facility?.name;
  const facilityPhone = getFacilityPhone(facility);

  return (
    <InfoAlert
      status="info"
      className="vads-u-display--block"
      headline="Need to make changes?"
      backgroundOnly
    >
      {!facility &&
        'To reschedule or cancel this appointment, contact the VA facility where you scheduled it.'}
      {!!facility &&
        'Contact this facility if you need to reschedule or cancel your appointment.'}
      <br />
      {!!facility && (
        <span className="vads-u-display--block vads-u-margin-top--2">
          {name}
          {facilityPhone && (
            <>
              <br />
              <FacilityPhone contact={facilityPhone} level={3} />
            </>
          )}
        </span>
      )}
    </InfoAlert>
  );
}
