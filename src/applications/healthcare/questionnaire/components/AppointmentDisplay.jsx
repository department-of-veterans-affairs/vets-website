import React from 'react';
import moment from 'moment';

export default function AppointmentDisplay({ appointment }) {
  if (!appointment) {
    return <></>;
  }
  const thisAppointment = appointment.vdsAppointments[0];
  const { clinic } = thisAppointment;
  return (
    <p>
      This is information is for your appointment at{' '}
      <span aria-label="Facility Name" className="vads-u-font-weight--bold">
        {clinic.facility.displayName}
      </span>{' '}
      at{' '}
      <span aria-label="Appointment time" className="vads-u-font-weight--bold">
        {moment(thisAppointment.appointmentTime).format('h:mm a')}
      </span>{' '}
      on{' '}
      <span aria-label="Appointment date" className="vads-u-font-weight--bold">
        {moment(thisAppointment.appointmentTime).format('MMMM Do, YYYY')}
      </span>
    </p>
  );
}
