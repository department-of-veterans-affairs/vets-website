import React from 'react';
import moment from 'moment-timezone';

import {
  appointmentSelector,
  organizationSelector,
  locationSelector,
} from '../../../shared/utils/selectors';

export default function AppointmentDisplay({ appointmentData, bold = true }) {
  if (!appointmentData) {
    return <></>;
  }
  const {
    appointment,
    location: clinic,
    organization: facility,
  } = appointmentData;

  const appointmentTime = appointmentSelector.getStartDateTime(appointment);
  const boldClass = bold ? 'vads-u-font-weight--bold' : '';

  const clinicName = locationSelector.getName(clinic);
  const facilityName = organizationSelector.getName(facility);
  const displayTime = appointmentSelector.getStartTimeInTimeZone(appointment);

  return (
    <dl className={`appointment-details`} itemScope>
      <div itemProp="appointment-date">
        <dt className={boldClass} data-testid="date-label">
          Date:{' '}
        </dt>
        <dd
          data-testid="appointment-date"
          aria-label={`Appointment date ${moment(appointmentTime).format(
            'dddd, MMMM Do, YYYY',
          )}`}
        >
          {moment(appointmentTime).format('dddd, MMMM D, YYYY')}
        </dd>
      </div>
      <div itemProp="appointment-time">
        <dt className={boldClass}>Time: </dt>
        <dd
          data-testid="appointment-time"
          aria-label={`Appointment time ${displayTime}`}
        >
          {displayTime}
        </dd>
      </div>
      <div itemProp="appointment-location">
        <dt className={boldClass}>Location: </dt>
        <dd
          data-testid="appointment-location"
          aria-label={`appointment at ${clinicName} at ${facilityName}`}
        >
          {clinicName}, {facilityName}
        </dd>
      </div>
    </dl>
  );
}
