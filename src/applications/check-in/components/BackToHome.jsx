import React, { useMemo } from 'react';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';

function BackToHome() {
  const preCheckInUrl = useMemo(
    () =>
      '/health-care/appointment-pre-check-in/?id=8312cf60-69e1-4d41-a45a-19092e031778',
    [],
  );
  const checkInUrl = useMemo(
    () =>
      '/health-care/appointment-check-in/?id=8312cf60-69e1-4d41-a45a-19092e031778',
    [],
  );

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <a data-testid="back-to-home-button" href={preCheckInUrl}>
        Start Pre Check in
      </a>
      |
      <a data-testid="back-to-home-button" href={checkInUrl}>
        Start Check in
      </a>
      |
      <a href="http://localhost:3001/health-care/appointment-pre-check-in/contact-information?id=8312cf60-69e1-4d41-a45a-19092e031778&title=Home%20phone&key=homePhone&originatingUrl=contact-information&editingPage=demographics#edit--homePhone">
        Edit test link
      </a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
