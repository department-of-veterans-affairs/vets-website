import React, { useState } from 'react';
import { api } from '../api';

import { goToNextPage, URLS } from '../utils/navigation';

import recordEvent from 'platform/monitoring/record-event';

export default function AppointmentAction(props) {
  const { isLowAuthEnabled, token, router } = props;

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

  return (
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
  );
}
