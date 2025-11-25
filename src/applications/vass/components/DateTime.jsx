import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';

const formatDateTime = dateString => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Format date as "Weekday, Month DD, YYYY"
  const formattedDate = formatInTimeZone(
    dateString,
    timezone,
    'EEEE, MMMM dd, yyyy',
  );

  // Format time as "HH:MM p.m. TZ"
  const formattedTime = formatInTimeZone(dateString, timezone, 'hh:mm a zzz');

  return { formattedDate, formattedTime };
};

const DateTime = ({ dateTime }) => {
  const { formattedDate, formattedTime } = formatDateTime(dateTime);
  return (
    <p
      className="vads-u-margin-top--0p5 vads-u-margin-bottom--1"
      data-testid="date-time-description"
    >
      {formattedDate}
      <br />
      {formattedTime}
    </p>
  );
};

DateTime.propTypes = {
  dateTime: PropTypes.string.isRequired,
};

export default DateTime;
