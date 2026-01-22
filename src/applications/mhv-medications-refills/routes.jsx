import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import manifest from './manifest.json';
import AppProviders from './containers/AppProviders';
import App from './containers/App';
import { refillsLoader } from './loaders/refillsLoader';

// Lazy load the main page component for code splitting
const MedicationsRefillPage = lazy(() =>
  import('./containers/MedicationsRefillPage'),
);

/**
 * Loading component displayed while lazy-loaded components are being fetched
 */
const Loading = () => (
  <va-loading-indicator
    message="Loading..."
    set-focus
    data-testid="loading-indicator"
  />
);

/**
 * RouteWrapper component
 * Wraps route components with necessary providers and layout
 * Handles lazy loading with Suspense
 */
const RouteWrapper = props => {
  const user = useSelector(selectUser);

  return (
    <AppProviders user={user}>
      <App>
        <Suspense fallback={<Loading />}>
          {props.children || <props.Component {...props} />}
        </Suspense>
      </App>
    </AppProviders>
  );
};

RouteWrapper.propTypes = {
  Component: PropTypes.elementType,
  children: PropTypes.node,
};

/**
 * Route definitions for the medications refills application
 * Uses React Router v6 with data loaders for prefetching
 */
const routes = [
  {
    path: '/',
    element: <RouteWrapper Component={MedicationsRefillPage} />,
    loader: refillsLoader, // Prefetch data using RTK Query before rendering
  },
];

// Create the router with basename from manifest
const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
