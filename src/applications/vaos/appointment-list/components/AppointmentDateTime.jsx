import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import React from 'react';
import { getAppointmentTimezone } from '../../services/appointment';

export function AppointmentDate({
  date,
  timezone,
  format = 'EEEE, MMMM d, yyyy',
}) {
  return (
    <span data-dd-privacy="mask">
      {' '}
      {formatInTimeZone(date, timezone, format)}{' '}
    </span>
  );
}
AppointmentDate.propTypes = {
  date: PropTypes.object,
  format: PropTypes.string,
  timezone: PropTypes.string,
};

export function AppointmentTime({ appointment, timezone, format = 'h:mm a' }) {
  if (!appointment) return null;

  const { abbreviation, description } = getAppointmentTimezone(appointment);
  return (
    <>
      <span data-dd-privacy="mask">
        {formatInTimeZone(appointment.start, timezone, format)}{' '}
      </span>
      <span aria-hidden="true">{abbreviation}</span>
      <span className="sr-only">{description}</span>
    </>
  );
}
AppointmentTime.propTypes = {
  appointment: PropTypes.shape({
    start: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  }),
  format: PropTypes.string,
  timezone: PropTypes.string,
};
