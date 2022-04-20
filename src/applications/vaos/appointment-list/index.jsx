import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import UrlSearchParams from 'url-search-params';
import AppointmentsPageV2 from './components/AppointmentsPageV2/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';

function AppointmentListSection() {
  useManualScrollRestoration();

  const location = useLocation();
  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () => {
      // Check search params to see if redirect is specified. If not, check
      // state.
      let isRedirect = new UrlSearchParams(location.search).get('redirect');
      if (isRedirect === null) isRedirect = location.state.redirect;
      return (
        isRedirect === null || isRedirect === undefined || isRedirect === 'true'
      );
    },
  });

  if (shouldRedirectToStart) {
    const path = window.location.pathname.replace('/appointments/', '/');
    window.location.replace(path);
  }

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
