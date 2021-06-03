import React from 'react';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  getUserTimezoneAbbr,
  stripDST,
} from '../../../utils/timezone';

function getAppointmentTimezoneAbbreviation(facilityId) {
  if (!facilityId) {
    return stripDST(getUserTimezoneAbbr());
  }
  return getTimezoneAbbrBySystemId(facilityId);
}

function getAppointmentTimezoneDescription(facilityId) {
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
