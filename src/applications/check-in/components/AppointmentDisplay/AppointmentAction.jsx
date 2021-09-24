import React, { useState } from 'react';
import { api } from '../../api';

import { goToNextPage, URLS } from '../../utils/navigation';
import { STATUSES, areEqual } from '../../utils/appointment/status';
import recordEvent from 'platform/monitoring/record-event';
import format from 'date-fns/format';

export default function AppointmentAction(props) {
  const { appointment, isLowAuthEnabled, token, router } = props;

  const [isCheckingIn, setIsCheckingIn] = useState(false);

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

  if (appointment.status) {
    if (areEqual(appointment.status, STATUSES.ELIGIBLE)) {
      return (
        <button
          type="button"
          className="usa-button usa-button-big vads-u-font-size--md"
          onClick={onClick}
          data-testid="check-in-button"
          disabled={isCheckingIn}
          aria-label="Check in now for your appointment"
        >
          {isCheckingIn ? <>Loading...</> : <>Check in now</>}
        </button>
      );
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_BAD_STATUS)) {
      return (
        <p data-testid="ineligible-bad-status-message">
          This appointment isn’t eligible for online check-in. Check-in with a
          staff member.
        </p>
      );
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_TOO_EARLY)) {
      const appointmentDateTime = new Date(appointment.startTime);
      const appointmentTime = format(appointmentDateTime, 'h:mm aaaa');
      return (
        <p data-testid="too-early-message">
          You can check in starting at this time: {appointmentTime}
        </p>
      );
    } else if (areEqual(appointment.status, STATUSES.INELIGIBLE_TOO_LATE)) {
      return (
        <p data-testid="too-late-message">
          Your appointment started more than 10 minutes ago. We can't check you
          in online. Ask a staff member for help.
        </p>
      );
    } else if (
      areEqual(appointment.status, STATUSES.INELIGIBLE_UNSUPPORTED_LOCATION)
    ) {
      return (
        <p data-testid="unsupported-location-message">
          This appointment isn’t eligible for online check-in. Check-in with a
          staff member.
        </p>
      );
    } else if (
      areEqual(appointment.status, STATUSES.INELIGIBLE_UNKNOWN_REASON)
    ) {
      return (
        <p data-testid="unknown-reason-message">
          This appointment isn’t eligible for online check-in. Check-in with a
          staff member.
        </p>
      );
    }
  } else {
    return (
      <p data-testid="no-status-given-message">
        This appointment isn’t eligible for online check-in. Check-in with a
        staff member.
      </p>
    );
  }
}
