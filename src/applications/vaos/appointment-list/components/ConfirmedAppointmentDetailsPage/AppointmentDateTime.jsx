import React from 'react';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
} from '../../../utils/timezone';

export function getAppointmentTimezoneAbbreviation(facilityId) {
  if (!facilityId) {
    return null;
  }
  return getTimezoneAbbrBySystemId(facilityId);
}

export function getAppointmentTimezoneDescription(facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

export default function AppointmentDateTime({ appointmentDate, facilityId }) {
  if (!appointmentDate.isValid()) {
    return null;
  }

  return (
    <>
      {appointmentDate.format('dddd, MMMM D, YYYY [at] h:mm a')}{' '}
      <span aria-hidden="true">
        {getAppointmentTimezoneAbbreviation(facilityId)}
      </span>
      <span className="sr-only">
        {' '}
        {getAppointmentTimezoneDescription(facilityId)}
      </span>
    </>
  );
}
