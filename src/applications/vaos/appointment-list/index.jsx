import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInPilotUserStations } from '../referral-appointments/hooks/useIsInPilotUserStations';
import ReferralsAndRequests from '../referral-appointments/ReferralsAndRequests';
import UpcomingAppointmentsDetailsPage from './pages/UpcomingAppointmentsDetailsPage';
import EpsAppointmentDetailsPage from '../referral-appointments/EpsAppointmentDetailsPage';
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
        {/* These are now exact so that you can still access the <whichever_route>/:id under each of them when linked */}
        {isInPilotUserStations && (
          <Redirect exact from="/pending" to="/referrals-requests" />
        )}
        {!isInPilotUserStations && (
          <Redirect exact from="/referrals-requests" to="/pending" />
        )}

        {isInPilotUserStations && (
          <Route
            exact
            path="/referrals-requests"
            component={ReferralsAndRequests}
          />
        )}
        <Route
          exact
          path={['/', '/pending', '/past']}
          component={AppointmentsPage}
        />
        <Route
          exact
          path="/pending/:id"
          component={RequestedAppointmentDetailsPage}
        />
        <Route
          exact
          path="/past/:id"
          component={UpcomingAppointmentsDetailsPage}
        />
        {/* NOTE: eps should probably also be exact */}
        {isInPilotUserStations &&
          eps && <Route path="/:id" component={EpsAppointmentDetailsPage} />}
        <Route exact path="/:id" component={UpcomingAppointmentsDetailsPage} />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}

export const AppointmentList = AppointmentListSection;
