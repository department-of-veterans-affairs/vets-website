import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppointmentsPage from './pages/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage';
import UpcomingAppointmentDetailsPage from './pages/UpcomingAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';

function AppointmentListSection() {
  useManualScrollRestoration();

  const featureBreadcrumbUrlUpdate = useSelector(state =>
    selectFeatureBreadcrumbUrlUpdate(state),
  );

  return (
    <>
      {!featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/:pastOrPending?/cc/:id"
            component={UpcomingAppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/va/:id"
            component={UpcomingAppointmentDetailsPage}
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
          <Route path="/pending" component={AppointmentsPage} />
          <Route path="/past/:id" component={UpcomingAppointmentDetailsPage} />
          <Route path="/past" component={AppointmentsPage} />
          <Route
            exact
            path={['/va/:id', '/:id']}
            component={UpcomingAppointmentDetailsPage}
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
