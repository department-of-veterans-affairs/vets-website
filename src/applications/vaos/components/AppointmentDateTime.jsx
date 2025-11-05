import React from 'react';
import PropTypes from 'prop-types';
import AppointmentDate from './AppointmentDate';
import AppointmentTime from './AppointmentTime';
import AddToCalendarButton from './AddToCalendarButton';

export default function AppointmentDateTime({
  start,
  timezone,
  showAddToCalendarButton,
  calendarData,
}) {
  return (
    <>
      <AppointmentDate date={start} timezone={timezone} />
      <br />
      <AppointmentTime date={start} timezone={timezone} />
      {showAddToCalendarButton && (
        <div className="vads-u-margin-top--1 vaos-hide-for-print">
          <AddToCalendarButton appointment={calendarData} />
        </div>
      )}
    </>
  );
}

AppointmentDateTime.propTypes = {
  start: PropTypes.string.isRequired,
  timezone: PropTypes.string.isRequired,
  calendarData: PropTypes.object,
  showAddToCalendarButton: PropTypes.bool,
};
