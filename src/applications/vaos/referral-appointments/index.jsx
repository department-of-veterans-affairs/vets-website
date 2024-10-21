import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduleReferral from './ScheduleReferral';
import ConfirmApprovedPage from './ConfirmApprovedPage';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureCCDirectScheduling } from '../redux/selectors';

export default function ReferralAppointments() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  const featureCCDirectScheduling = useSelector(
    selectFeatureCCDirectScheduling,
  );
  return (
    <>
      {!featureCCDirectScheduling && <Redirect from={basePath.url} to="/" />}
      <Switch>
        <Route
          path={`${basePath.url}/review`}
          component={ConfirmApprovedPage}
        />
        <Route
          path={`${basePath.url}/date-time`}
          component={ChooseDateAndTime}
        />
        <Route path={`${basePath.url}/:id`} component={ScheduleReferral} />
      </Switch>
    </>
  );
}
