/* eslint-disable @department-of-veterans-affairs/no-cross-app-imports */
import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import AppConfig from './containers/AppConfig';

// Lazy-loaded components
const LandingPageContainer = lazy(() =>
  import('./containers/LandingPageContainer'),
);
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
      <Routes>
        <Route
          path="/"
          element={<LandingPageContainer />}
          key="mhvLandingPage"
        />
        <Route
          path="/my-secure-messages/*"
          element={<MhvSecureMessagingRoutes />}
          key="mhvSecureMessages"
        />
        <Route
          path="/my-appointments/*"
          element={<AppointmentsRoutes />}
          key="appointments"
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  </AppConfig>
);

export default routes;
