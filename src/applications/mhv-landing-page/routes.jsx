/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';

// Lazy-loaded components
const LandingPageContainer = lazy(() =>
  import('./containers/LandingPageContainer'),
);
const MhvMedcationsRoutes = lazy(() => import('../mhv-medications/routes'));
const MhvSecureMessagingRoutes = lazy(() =>
  import('../mhv-secure-messaging/routes'),
);
const AppointmentsRoutes = lazy(() => import('../vaos/routes'));

// Loading component to display while lazy-loaded components are being fetched
const Loading = () => (
  <va-loading-indicator
    message="Loading..."
    set-focus
    data-testid="loading-indicator"
  />
);

const routes = (
  <AppConfig>
    <Suspense fallback={<Loading />}>
      <Switch>
        <Route exact path="/" key="mhvLandingPage">
          <LandingPageContainer />
        </Route>
        <Route
          exact
          path={['/my-medications', '/my-medications/*']}
          key="mhvMedications"
        >
          <MhvMedcationsRoutes />
        </Route>
        <Route
          exact
          path={['/my-secure-messages', '/my-secure-messages/*']}
          key="mhvSecureMessages"
        >
          <MhvSecureMessagingRoutes />
        </Route>
        <Route
          exact
          path={['/my-appointments', '/my-appointments/*']}
          key="appointments"
        >
          <AppointmentsRoutes />
        </Route>

        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  </AppConfig>
);

export default routes;
