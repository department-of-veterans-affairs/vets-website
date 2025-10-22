import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import ScheduleReferral from './ScheduleReferral';
import ReviewAndConfirm from './ReviewAndConfirm';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInPilotUserStations } from './hooks/useIsInPilotUserStations';
import CompleteReferral from './CompleteReferral';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const { isInPilotUserStations } = useIsInPilotUserStations();

  if (!isInPilotUserStations) {
    return <Redirect from={basePath.url} to="/" />;
  }

  return (
    <>
      <Switch>
        <Route path={`${basePath.url}/complete/:appointmentId`}>
          <CompleteReferral />
        </Route>
        <Route path={`${basePath.url}/review/`}>
          <ReviewAndConfirm />
        </Route>
        <Route path={`${basePath.url}/date-time/`}>
          <ChooseDateAndTime />
        </Route>
        <Route path={`${basePath.url}`}>
          <ScheduleReferral />
        </Route>
      </Switch>
    </>
  );
}
