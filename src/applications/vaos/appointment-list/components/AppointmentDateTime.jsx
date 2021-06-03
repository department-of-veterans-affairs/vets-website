import React from 'react';
import moment from 'moment';
import { getAppointmentTimezone } from '../../services/appointment';

export default function AppointmentDateTime({ appointment }) {
  const appointmentDate = moment.parseZone(appointment.start);
  const { abbreviation, description } = getAppointmentTimezone(appointment);

  return (
    <>
      {appointmentDate.format('dddd, MMMM D, YYYY [at] h:mm a')}{' '}
      <span aria-hidden="true">{abbreviation}</span>
      <span className="sr-only"> {description}</span>
    </>
  );
}
