import React from 'react';
import {
  getAppointmentTimezoneAbbreviation,
  getAppointmentTimezoneDescription,
} from '../../../../utils/appointment';

export default function AppointmentDateTime({
  appointmentDate,
  timezone,
  facilityId,
  twoLineFormat,
}) {
  if (!appointmentDate.isValid()) {
    return null;
  }

  return (
    <>
      {!twoLineFormat && (
        <>{appointmentDate.format('dddd, MMMM D, YYYY [at] h:mm a')} </>
      )}
      {twoLineFormat && (
        <>
          {appointmentDate.format('dddd, MMMM D, YYYY')} <br />
          {appointmentDate.format('h:mm a')}{' '}
        </>
      )}
      <span aria-hidden="true">
        {getAppointmentTimezoneAbbreviation(timezone, facilityId)}
      </span>
      <span className="sr-only">
        {' '}
        {getAppointmentTimezoneDescription(timezone, facilityId)}
      </span>
    </>
  );
}
