import React from 'react';
import PropTypes from 'prop-types';
import { formatInTimeZone } from 'date-fns-tz';
import {
  getFormattedTimezoneAbbr,
  getTimezoneDescByTimeZoneString,
} from '../utils/timezone';

/**
 * Component for displaying appointment time in a consistent format with timezone
 */
export default function AppointmentTime({ date, timezone }) {
  const formattedTime = formatInTimeZone(new Date(date), timezone, 'h:mm aaaa');
  const timezoneAbbreviation = getFormattedTimezoneAbbr(date, timezone);
  const timezoneDescription = getTimezoneDescByTimeZoneString(timezone);
  return (
    <div data-dd-privacy="mask" data-testid="appointment-time">
      {`${formattedTime} `}
      <span aria-hidden="true" data-testid="appointment-time-abbreviation">
        {timezoneAbbreviation}
      </span>
      <span className="sr-only" data-testid="appointment-time-description">
        {`${formattedTime} ${timezoneAbbreviation}`}
        {`Appointment time in ${timezoneDescription}`}
      </span>
    </div>
  );
}

AppointmentTime.propTypes = {
  date: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
};
