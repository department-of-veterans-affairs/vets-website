import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Component for displaying appointment date in a consistent format
 */
export default function AppointmentDate({ date, timezone }) {
  const formattedDate = formatInTimeZone(
    new Date(date),
    timezone,
    'EEEE, MMMM do, yyyy',
  );

  return (
    <span data-dd-privacy="mask" data-testid="appointment-date">
      {formattedDate}
    </span>
  );
}

AppointmentDate.propTypes = {
  date: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
