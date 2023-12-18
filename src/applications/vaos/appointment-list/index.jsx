import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AppointmentsPage from './components/AppointmentsPage/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';

function AppointmentListSection() {
  useManualScrollRestoration();

  return (
    <>
      <Switch>
        <Route
          path="/pending/:id"
          component={RequestedAppointmentDetailsPage}
        />
        <Route path="/pending" component={AppointmentsPage} />
        <Route path="/past/:id" component={ConfirmedAppointmentDetailsPage} />
        <Route path="/past" component={AppointmentsPage} />
        <Route
          path={['/va/:id', '/:id']}
          component={ConfirmedAppointmentDetailsPage}
        />
        <Route path="/" component={AppointmentsPage} />
      </Switch>
    </>
  );
}

export const AppointmentList = AppointmentListSection;
