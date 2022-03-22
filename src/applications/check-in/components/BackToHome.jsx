import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';
import { makeSelectApp } from '../selectors';

function BackToHome() {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  let restartURL =
    '/health-care/appointment-pre-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  if (app !== 'preCheckIn') {
    restartURL =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 ">
      <a data-testid="back-to-home-button" href={restartURL}>
        Start again
      </a>
      |
      <a href="http://localhost:3001/health-care/appointment-pre-check-in/contact-information?id=46bebc0a-b99c-464f-a5c5-560bc9eae287&title=Home%20phone&key=homePhone&originatingUrl=contact-information&editingPage=demographics#edit--homePhone">
        Edit test link
      </a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
