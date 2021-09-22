import React, { useState } from 'react';
import format from 'date-fns/format';
import AppointmentLocation from '../../components/AppointmentLocation';

import { api } from '../../api';

import { goToNextPage, URLS } from '../../utils/navigation';

import recordEvent from 'platform/monitoring/record-event';

export default function AppointmentListItem(props) {
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const { appointment, isLowAuthEnabled, token, router } = props;
  const onClick = async () => {
    recordEvent({
      event: 'cta-button-click',
      'button-click-label': 'check in now',
    });
    setIsCheckingIn(true);
    try {
      const checkIn = isLowAuthEnabled
        ? api.v1.postCheckInData
        : api.v0.checkInUser;

      const json = await checkIn({
        token,
      });
      const { status } = json;
      if (status === 200) {
        goToNextPage(router, URLS.COMPLETE);
      } else {
        goToNextPage(router, URLS.ERROR);
      }
    } catch (error) {
      goToNextPage(router, URLS.ERROR);
    }
  };

  const appointmentDateTime = new Date(appointment.startTime);
  const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
  return (
    <li className="appointment-item vads-u-padding--2">
      <dl className="appointment-summary">
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
          className="clinic-name vads-u-font-size--lg vads-u-font-weight--bold"
        >
          <AppointmentLocation appointment={appointment} />
        </dd>
      </dl>
      <button
        type="button"
        className="usa-button usa-button-big"
        onClick={onClick}
        data-testid="check-in-button"
        disabled={isCheckingIn}
        aria-label="Check in now for your appointment"
      >
        {isCheckingIn ? <>Loading...</> : <>Check in now</>}
      </button>
    </li>
  );
}
