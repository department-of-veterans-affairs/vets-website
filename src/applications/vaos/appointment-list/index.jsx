import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInPilotUserStations } from '../referral-appointments/hooks/useIsInPilotUserStations';
import ReferralsAndRequests from '../referral-appointments/ReferralsAndRequests';
import UpcomingAppointmentsDetailsPage from './pages/UpcomingAppointmentsDetailsPage';
import EpsAppointmentDetailsPage from './pages/EpsAppointmentDetailsPage/EpsAppointmentDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage/RequestedAppointmentDetailsPage';

function AppointmentListSection() {
  useManualScrollRestoration();

  const { isInPilotUserStations } = useIsInPilotUserStations();
  const location = useLocation();

  // Parse the query parameters
  const searchParams = new URLSearchParams(location.search);
  const eps = searchParams.get('eps'); // Get the 'eps' query parameter

  return (
    <>
      <Switch>
        <Route
          path="/pending/:id"
          component={RequestedAppointmentDetailsPage}
        />

        {isInPilotUserStations && (
          <Redirect from="/pending" to="/referrals-requests" />
        )}
        {!isInPilotUserStations && (
          <Redirect from="/referrals-requests" to="/pending" />
        )}

        {isInPilotUserStations && (
          <Route path="/referrals-requests" component={ReferralsAndRequests} />
        )}
        <Route
          exact
          path={['/', '/pending', '/past']}
          component={AppointmentsPage}
        />
        <Route
          exact
          path="/past/:id"
          component={UpcomingAppointmentsDetailsPage}
        />
        {isInPilotUserStations &&
          eps && <Route path="/:id" component={EpsAppointmentDetailsPage} />}
        <Route exact path="/:id" component={UpcomingAppointmentsDetailsPage} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}

export const AppointmentList = AppointmentListSection;
