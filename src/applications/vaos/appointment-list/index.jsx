import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
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
            component={ConfirmedAppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/va/:id"
            component={ConfirmedAppointmentDetailsPage}
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
          <Route path="/past/:id" component={ConfirmedAppointmentDetailsPage} />
          <Route path="/past" component={AppointmentsPage} />
          <Route
            exact
            path={['/va/:id', '/:id']}
            component={ConfirmedAppointmentDetailsPage}
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
