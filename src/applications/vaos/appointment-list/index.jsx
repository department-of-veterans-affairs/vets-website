import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import { useIsInCCPilot } from '../referral-appointments/hooks/useIsInCCPilot';
import ReferralsAndRequests from '../referral-appointments/ReferralsAndRequests';
import UpcomingAppointmentsDetailsPage from './pages/UpcomingAppointmentsDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage/RequestedAppointmentDetailsPage';

function AppointmentListSection() {
  useManualScrollRestoration();

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );
  const { isInCCPilot } = useIsInCCPilot();
  return (
    <>
      {!featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/:pastOrPending?/cc/:id"
            component={UpcomingAppointmentsDetailsPage}
          />
          <Route
            path="/:pastOrPending?/va/:id"
            component={UpcomingAppointmentsDetailsPage}
          />
          <Route
            path="/:pastOrPending?/requests/:id"
            component={RequestedAppointmentDetailsPage}
          />
          <Route path="/" component={AppointmentsPage} />
        </Switch>
      )}
      {featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/pending/:id"
            component={RequestedAppointmentDetailsPage}
          />

          {isInCCPilot && <Redirect from="/pending" to="/referrals-requests" />}

          <Route path="/pending" component={AppointmentsPage} />
          {isInCCPilot && (
            <Route
              path="/referrals-requests"
              component={ReferralsAndRequests}
            />
          )}
          <Route path="/past/:id" component={UpcomingAppointmentsDetailsPage} />
          <Route path="/past" component={AppointmentsPage} />
          <Route
            exact
            path={['/va/:id', '/:id']}
            component={UpcomingAppointmentsDetailsPage}
          />
          <Route
            exact
            path={['/', '/pending', '/past']}
            component={AppointmentsPage}
          />
          <Route component={PageNotFound} />
        </Switch>
      )}
    </>
  );
}

export const AppointmentList = AppointmentListSection;
