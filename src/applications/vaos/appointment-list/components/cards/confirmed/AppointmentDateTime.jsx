import React from 'react';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneDescFromAbbr,
  stripDST,
} from '../../../../utils/timezone';

export function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone;
  return stripDST(tzAbbr);
}

export function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneDescFromAbbr(abbr);
}

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
