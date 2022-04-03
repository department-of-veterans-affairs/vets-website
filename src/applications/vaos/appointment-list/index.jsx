import React from 'react';
import { Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import UrlSearchParams from 'url-search-params';
import { useSelector } from 'react-redux';
import AppointmentsPageV2 from './components/AppointmentsPageV2/index';
import RequestedAppointmentDetailsPage from './components/RequestedAppointmentDetailsPage';
import ConfirmedAppointmentDetailsPage from './components/ConfirmedAppointmentDetailsPage';
import CommunityCareAppointmentDetailsPage from './components/CommunityCareAppointmentDetailsPage';
import useManualScrollRestoration from '../hooks/useManualScrollRestoration';
import useFormRedirectToStart from '../hooks/useFormRedirectToStart';
import { selectFeatureStatusImprovement } from '../redux/selectors';

function AppointmentListSection() {
  useManualScrollRestoration();
  const location = useLocation();
  const match = useRouteMatch();
  const featureStatusImprovement = useSelector(state =>
    selectFeatureStatusImprovement(state),
  );

  const shouldRedirectToStart = useFormRedirectToStart({
    shouldRedirect: () => {
      if (featureStatusImprovement) return false;
      const isRedirect = new UrlSearchParams(location.search).get('redirect');
      return !isRedirect || isRedirect === 'true';
    },
  });

  if (shouldRedirectToStart) {
    const path = window.location.pathname.replace('/appointments/', '/');
    window.location.replace(path);
  }

  return (
    <Switch>
      <Route
        path={`${
          match.path.endsWith('/') ? match.path.slice(0, -1) : match.path
        }/cc/:id`}
        component={CommunityCareAppointmentDetailsPage}
      />
      <Route
        path={`${
          match.path.endsWith('/') ? match.path.slice(0, -1) : match.path
        }/va/:id`}
        component={ConfirmedAppointmentDetailsPage}
      />
      <Route
        path={`${
          match.path.endsWith('/') ? match.path.slice(0, -1) : match.path
        }/requests/:id`}
        component={RequestedAppointmentDetailsPage}
      />
      <Route
        path={`${match.path}`}
        render={() => {
          return <AppointmentsPageV2 />;
        }}
      />
    </Switch>
  );
}

export const AppointmentList = AppointmentListSection;
