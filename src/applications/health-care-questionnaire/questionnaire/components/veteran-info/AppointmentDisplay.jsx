import React from 'react';
import moment from 'moment';

export default function AppointmentDisplay({ appointment }) {
  if (
    !appointment?.attributes ||
    !appointment.attributes.vdsAppointments ||
    !appointment.attributes.vdsAppointments[0]
  ) {
    return <></>;
  }
  const thisAppointment = appointment.attributes.vdsAppointments[0];
  const { clinic } = thisAppointment;
  return (
    <p>
      You have an upcoming appointment at{' '}
      <span data-testid="facility-name" aria-label="Facility Name">
        {clinic.facility.displayName}
      </span>{' '}
      at{' '}
      <span data-testid="appointment-time" aria-label="Appointment time">
        {moment(thisAppointment.appointmentTime).format('h:mm a')}
      </span>{' '}
      on{' '}
      <span data-testid="appointment-date" aria-label="Appointment date">
        {moment(thisAppointment.appointmentTime).format('MMMM Do, YYYY')}.
      </span>
    </p>
  );
}
