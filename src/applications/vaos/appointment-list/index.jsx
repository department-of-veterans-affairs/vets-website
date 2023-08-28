import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppointmentsPageV2 from './components/AppointmentsPageV2/index';
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
          <Route path="/" component={AppointmentsPageV2} />
        </Switch>
      )}
      {featureBreadcrumbUrlUpdate && (
        <Switch>
          <Route
            path="/:pastOrPending?/:id"
            component={ConfirmedAppointmentDetailsPage}
          />
          <Route
            path="/:pastOrPending?/requests/:id"
            component={RequestedAppointmentDetailsPage}
          />
          <Route path="/" component={AppointmentsPageV2} />
        </Switch>
      )}
    </>
  );
}

export const AppointmentList = AppointmentListSection;
