import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

/**
 * Component for displaying appointment date in a consistent format
 */
export default function AppointmentDate({ date }) {
  const formattedDate = format(new Date(date), 'EEEE, MMMM do, yyyy');

  return (
    <span data-dd-privacy="mask" data-testid="appointment-date">
      {formattedDate}
    </span>
  );
}

AppointmentDate.propTypes = {
  date: PropTypes.string.isRequired,
};
