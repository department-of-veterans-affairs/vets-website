import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import { selectFeatureBreadcrumbUrlUpdate } from '../redux/selectors';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import RequestedAppointmentDetailsPage from './pages/RequestedAppointmentDetailsPage';

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
            component={AppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/va/:id"
            component={AppointmentDetailsPage}
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
          <Route path="/past/:id" component={AppointmentDetailsPage} />
          <Route path="/past" component={AppointmentsPage} />
          <Route
            exact
            path={['/va/:id', '/:id']}
            component={AppointmentDetailsPage}
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
