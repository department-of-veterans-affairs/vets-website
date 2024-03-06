import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import withOnlyOnLocal from '../containers/withOnlyOnLocal';
import { makeSelectApp } from '../selectors';

function BackToHome() {
  const selectApp = useMemo(makeSelectApp, []);
  const { app } = useSelector(selectApp);
  const { t } = useTranslation();
  let restartURL =
    '/health-care/appointment-pre-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  if (app === 'checkIn') {
    restartURL =
      '/health-care/appointment-check-in/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  }
  if (app === 'travelClaim') {
    restartURL =
      '/my-health/appointment-travel-claim/?id=46bebc0a-b99c-464f-a5c5-560bc9eae287';
  }
  return (
    <div className="vads-l-grid-container vads-u-padding-bottom--5 vads-u-padding-top--2 local-start-again">
      <a data-testid="back-to-home-button" href={restartURL}>
        {t('start-again')}
      </a>
    </div>
  );
}

export default withOnlyOnLocal(BackToHome);
