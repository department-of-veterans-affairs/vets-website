import React from 'react';
import moment from 'moment-timezone';

import {
  getClinicFromAppointment,
  getAppointmentTimeFromAppointment,
} from '../../utils';

export default function AppointmentDisplay({ appointment, bold }) {
  const appointmentTime = getAppointmentTimeFromAppointment(appointment);
  const clinic = getClinicFromAppointment(appointment);
  if (!clinic) {
    return <></>;
  }

  const boldClass = bold ? 'vads-u-font-weight--bold' : '';
  const guess = moment.tz.guess();
  const formattedTimezone = moment.tz(guess).format('z');

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
          aria-label={`Appointment time ${moment(appointmentTime).format(
            'h:mm a z',
          )}`}
        >
          {moment(appointmentTime).format('h:mm a')} {formattedTimezone}
        </dd>
      </div>
      <div itemProp="appointment-location">
        <dt>Location: </dt>
        <dd
          data-testid="appointment-location"
          aria-label={`appointment at ${clinic.friendlyName} at ${
            clinic.facility.displayName
          }`}
        >
          {clinic.friendlyName}, {clinic.facility.displayName}
        </dd>
      </div>
    </dl>
  );
}
