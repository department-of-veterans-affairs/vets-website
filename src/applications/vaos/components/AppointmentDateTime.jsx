import React from 'react';
import {
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
} from '../utils/appointment';

export default function AppointmentDateTime({
  appointmentDate,
  timezone,
  facilityId,
}) {
  if (!appointmentDate.isValid()) {
    return null;
  }

  return (
    <>
      {appointmentDate.format('dddd, MMMM D, YYYY')} at{' '}
      {appointmentDate.format('h:mm')}
      <span aria-hidden="true">
        {' '}
        {appointmentDate.format('a')}{' '}
        {getAppointmentTimezoneAbbreviation(timezone, facilityId)}
      </span>
      <span className="sr-only">
        {appointmentDate.format('a')}{' '}
        {getAppointmentTimezoneDescription(timezone, facilityId)}
      </span>
    </>
  );
}
