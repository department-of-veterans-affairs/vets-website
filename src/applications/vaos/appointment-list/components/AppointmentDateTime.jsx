import { formatInTimeZone } from 'date-fns-tz';
import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import { getAppointmentTimezone } from '../../services/appointment';
import { DATE_FORMATS } from '../../utils/constants';
import { selectFeatureUseBrowserTimezone } from '../../redux/selectors';

export function AppointmentDate({
  date,
  timezone,
  format = DATE_FORMATS.friendlyWeekdayDate,
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

export function AppointmentTime({
  appointment,
  timezone,
  format = 'h:mm aaaa',
}) {
  const featureUseBrowserTimezone = useSelector(
    selectFeatureUseBrowserTimezone,
  );

  if (!appointment) return null;

  const { abbreviation, description } = getAppointmentTimezone(
    appointment,
    featureUseBrowserTimezone,
  );
  return (
    <>
      <span data-dd-privacy="mask" data-testid="appointment-time">
        {formatInTimeZone(appointment.start, timezone, format)}{' '}
      </span>
      <span aria-hidden="true" data-testid="appointment-time-abbreviation">
        {abbreviation}
      </span>
      <span className="sr-only" data-testid="appointment-time-description">
        {description}
      </span>
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
