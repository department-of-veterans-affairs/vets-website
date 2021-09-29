import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AppointmentsPageV2 from './components/AppointmentsPageV2/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';

function AppointmentListSection() {
  useManualScrollRestoration();
  return (
    <Switch>
      <Route path="/cc/:id" component={CommunityCareAppointmentDetailsPage} />
      <Route path="/va/:id" component={ConfirmedAppointmentDetailsPage} />
      <Route path="/requests/:id" component={RequestedAppointmentDetailsPage} />
      <Route path="/" component={AppointmentsPageV2} />
    </Switch>
  );
}

export const AppointmentList = AppointmentListSection;
