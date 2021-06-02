import React from 'react';
import {
  getTimezoneAbbrBySystemId,
  getTimezoneNameFromAbbr,
  stripDST,
  getUserTimezoneAbbr,
} from '../../../../utils/timezone';

export function getAppointmentTimezoneAbbreviation(timezone, facilityId) {
  if (facilityId) {
    return getTimezoneAbbrBySystemId(facilityId);
  }

  const tzAbbr = timezone?.split(' ')?.[1] || timezone || getUserTimezoneAbbr();
  return stripDST(tzAbbr);
}

export function getAppointmentTimezoneDescription(timezone, facilityId) {
  const abbr = getAppointmentTimezoneAbbreviation(timezone, facilityId);

  return getTimezoneNameFromAbbr(abbr);
}

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
      <>{appointmentDate.format('dddd, MMMM D, YYYY [at] h:mm a')} </>
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
