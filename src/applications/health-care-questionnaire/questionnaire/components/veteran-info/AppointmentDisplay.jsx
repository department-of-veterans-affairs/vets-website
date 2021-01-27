import React from 'react';
import moment from 'moment';

import {
  getClinicFromAppointment,
  getAppointmentTimeFromAppointment,
} from '../../utils';

export default function AppointmentDisplay({ appointment }) {
  const appointmentTime = getAppointmentTimeFromAppointment(appointment);
  const clinic = getClinicFromAppointment(appointment);
  if (!clinic) {
    return <></>;
  }

  return (
    <dl className="appointment-details vads-u-font-weight--bold" itemScope>
      <div itemProp="appointment-date">
        <dt>Date: </dt>
        <dd data-testid="appointment-date" aria-label="Appointment date">
          {' '}
          {moment(appointmentTime).format('MMMM Do, YYYY')}
        </dd>
      </div>
      <div itemProp="appointment-time">
        <dt>Time: </dt>
        <dd data-testid="appointment-time" aria-label="Appointment time">
          {' '}
          {moment(appointmentTime).format('h:mm a z')}
        </dd>
      </div>
      <div itemProp="appointment-location">
        <dt>Location: </dt>
        <dd data-testid="facility-name" aria-label="Facility Name">
          {' '}
          {clinic.friendlyName}, {clinic.facility.displayName}
        </dd>
      </div>
    </dl>
  );
}
