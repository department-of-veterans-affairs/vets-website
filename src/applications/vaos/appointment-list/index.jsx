import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import React from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { useIsInCCPilot } from '../referral-appointments/hooks/useIsInCCPilot';
import ReferralsAndRequests from '../referral-appointments/ReferralsAndRequests';
import UpcomingAppointmentsDetailsPage from './pages/UpcomingAppointmentsDetailsPage';
import EpsAppointmentDetailsPage from '../referral-appointments/EpsAppointmentDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage/RequestedAppointmentDetailsPage';

function AppointmentListSection() {
  useManualScrollRestoration();

  const { isInCCPilot } = useIsInCCPilot();
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

        {isInCCPilot && <Redirect from="/pending" to="/referrals-requests" />}

        <Route path="/pending" component={AppointmentsPage} />
        {isInCCPilot &&
          eps && <Route path="/:id" component={EpsAppointmentDetailsPage} />}

        {isInCCPilot && (
          <Route path="/referrals-requests" component={ReferralsAndRequests} />
        )}
        <Route path="/past/:id" component={UpcomingAppointmentsDetailsPage} />
        <Route path="/past" component={AppointmentsPage} />
        <Route exact path="/:id" component={UpcomingAppointmentsDetailsPage} />
        <Route
          exact
          path={['/', '/pending', '/past']}
          component={AppointmentsPage}
        />
        <Route component={PageNotFound} />
      </Switch>
    </>
  );
}

export const AppointmentList = AppointmentListSection;
