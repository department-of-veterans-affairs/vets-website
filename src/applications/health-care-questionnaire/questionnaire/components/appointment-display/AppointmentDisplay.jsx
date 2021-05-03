import React from 'react';
import moment from 'moment-timezone';

import {
  appointmentSelector,
  organizationSelector,
  locationSelector,
} from '../../../shared/utils/selectors';

export default function AppointmentDisplay({ appointmentData, bold }) {
  if (!appointmentData) {
    return <></>;
  }
  const {
    appointment,
    location: clinic,
    organization: facility,
  } = appointmentData;

  const appointmentTime = appointmentSelector.getStartTime(appointment);
  const boldClass = bold ? 'vads-u-font-weight--bold' : '';

  const clinicName = locationSelector.getName(clinic);
  const facilityName = organizationSelector.getName(facility);
  const displayTime = appointmentSelector.getStartTimeInTimeZone(appointment);

  return (
    <dl className={`appointment-details ${boldClass}`} itemScope>
      <div itemProp="appointment-date">
        <dt>Date: </dt>
        <dd
          data-testid="appointment-date"
          aria-label={`Appointment date ${moment(appointmentTime).format(
            'dddd, MMMM Do, YYYY',
          )}`}
        >
          {moment(appointmentTime).format('dddd, MMMM Do, YYYY')}
        </dd>
      </div>
      <div itemProp="appointment-time">
        <dt>Time: </dt>
        <dd
          data-testid="appointment-time"
          aria-label={`Appointment time ${displayTime}`}
        >
          {displayTime}
        </dd>
      </div>
      <div itemProp="appointment-location">
        <dt>Location: </dt>
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
