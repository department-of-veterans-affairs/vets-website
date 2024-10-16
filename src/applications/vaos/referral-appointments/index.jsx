import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import AppointmentNotificationPage from './AppointmentNotificationsPage';
import ReferralReview from './ReferralReview';
import ConfirmApprovedPage from './ConfirmApprovedPage';
import ChooseDateAndTime from './ChooseDateAndTime';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';

export default function ReferralList() {
  useManualScrollRestoration();
  const basePath = useRouteMatch();
  return (
    <Switch>
      <Route
        path={`${basePath.url}/appointment-notifications`}
        component={AppointmentNotificationPage}
      />
      <Route
        path={`${basePath.url}/confirm-approved`}
        component={ConfirmApprovedPage}
      />
      <Route path={`${basePath.url}/review/:id`} component={ReferralReview} />
      <Route path={`${basePath.url}/date-time`} component={ChooseDateAndTime} />
    </Switch>
  );
}
