import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';
import { makeSelectApp } from '../selectors';

import { APP_NAMES } from '../utils/appConstants';

function BackToHome() {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const preCheckInUrl =
    '/health-care/appointment-pre-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  const checkInUrl =
    '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  const restartURL =
    app === APP_NAMES.PRE_CHECK_IN ? preCheckInUrl : checkInUrl;

  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <a data-testid="back-to-home-button" href={restartURL}>
        Start again
      </a>
      |
      <a data-testid="back-to-home-button" href={preCheckInUrl}>
        Start PRE CHECK IN
      </a>
      |
      <a data-testid="back-to-home-button" href={checkInUrl}>
        Start CHECK IN
      </a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
