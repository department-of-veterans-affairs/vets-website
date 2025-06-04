import { format as _format } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import { getAppointmentTimezone } from '../../services/appointment';

export function AppointmentDate({ date, format = 'EEEE, MMMM d, yyyy' }) {
  return <> {_format(date, format)} </>;
}
AppointmentDate.propTypes = {
  date: PropTypes.object,
  format: PropTypes.string,
};

export function AppointmentTime({ appointment, format = 'h:mm aaa' }) {
  if (!appointment) return null;

  const time = appointment.start ? new Date(appointment.start) : new Date();
  const { abbreviation, description } = getAppointmentTimezone(appointment);

  return (
    <>
      {`${_format(time, format)} `}
      <span aria-hidden="true">{abbreviation}</span>
      <span className="sr-only">{description}</span>
    </>
  );
}
AppointmentTime.propTypes = {
  appointment: PropTypes.object,
  format: PropTypes.string,
};

export default function AppointmentDateTime({ appointment }) {
  const appointmentDate = new Date(appointment.start);
  const { abbreviation, description } = getAppointmentTimezone(appointment);

  return (
    <>
      {_format(appointmentDate, "EEEE, MMMM d, yyyy 'at' h:mm aaa")}{' '}
      <span aria-hidden="true">{abbreviation}</span>
      <span className="sr-only"> {description}</span>
    </>
  );
}
AppointmentDateTime.propTypes = {
  appointment: PropTypes.object,
};
