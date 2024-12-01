import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getAppointmentTimezone } from '../../services/appointment';

export function AppointmentDate({ date, format = 'dddd, MMMM D, YYYY' }) {
  return <> {moment.parseZone(date).format(format)} </>;
}
AppointmentDate.propTypes = {
  date: PropTypes.object,
  format: PropTypes.string,
};

export function AppointmentTime({ appointment, format = 'h:mm a' }) {
  if (!appointment) return null;

  const time = moment.parseZone(appointment.start);
  const { abbreviation, description } = getAppointmentTimezone(appointment);

  return (
    <>
      {`${time.format(format)} `}
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
AppointmentDateTime.propTypes = {
  appointment: PropTypes.object,
};
