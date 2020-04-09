import React from 'react';
import {
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
} from '../utils/appointment';

export default function AppointmentDateTime({ appointment }) {
  const appointmentDate = appointment.appointmentDate;

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
        {getAppointmentTimezoneAbbreviation(appointment)}
      </span>
      <span className="sr-only">
        {appointmentDate.format('a')}{' '}
        {getAppointmentTimezoneDescription(appointment)}
      </span>
    </>
  );
}
