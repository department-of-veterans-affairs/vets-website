import React from 'react';
import moment from 'moment';

export default function AppointmentDisplay({ appointment }) {
  if (!appointment?.vdsAppointments || !appointment.vdsAppointments[0]) {
    return <></>;
  }
  const thisAppointment = appointment.vdsAppointments[0];
  const { clinic } = thisAppointment;
  return (
    <p>
      This is information is for your appointment at{' '}
      <span
        data-testid="facility-name"
        aria-label="Facility Name"
        className="vads-u-font-weight--bold"
      >
        {clinic.facility.displayName}
      </span>{' '}
      at{' '}
      <span
        data-testid="appointment-time"
        aria-label="Appointment time"
        className="vads-u-font-weight--bold"
      >
        {moment(thisAppointment.appointmentTime).format('h:mm a')}
      </span>{' '}
      on{' '}
      <span
        data-testid="appointment-date"
        aria-label="Appointment date"
        className="vads-u-font-weight--bold"
      >
        {moment(thisAppointment.appointmentTime).format('MMMM Do, YYYY')}
      </span>
    </p>
  );
}
