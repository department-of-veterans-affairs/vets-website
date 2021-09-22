import React from 'react';
import format from 'date-fns/format';
import AppointmentLocation from '../../components/AppointmentLocation';

import AppointmentAction from '../../components/AppointmentAction';

export default function AppointmentListItem(props) {
  const { appointment, isLowAuthEnabled, token, router } = props;

  const appointmentDateTime = new Date(appointment.startTime);
  const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
  return (
    <li className="appointment-item vads-u-padding--2">
      <dl className="appointment-summary vads-u-margin--0 vads-u-padding--0">
        <dd
          className="appointment-time vads-u-font-family--serif vads-u-font-weight--bold"
          data-testid="appointment-time"
        >
          {appointmentTime}
        </dd>
        <dt className="clinic-label vads-u-font-size--lg vads-u-margin--0 vads-u-margin-right--1 vads-u-font-family--serif vads-u-font-weight--bold">
          Clinic:{' '}
        </dt>
        <dd
          data-testid="clinic-name"
          className="clinic-name vads-u-font-size--lg vads-u-font-weight--bold vads-u-font-family--serif"
        >
          <AppointmentLocation appointment={appointment} />
        </dd>
      </dl>
      <AppointmentAction
        appointment={appointment}
        isLowAuthEnabled={isLowAuthEnabled}
        router={router}
        token={token}
      />
    </li>
  );
}
