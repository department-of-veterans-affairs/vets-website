import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import App from './containers/App';
import RxBreadcrumbs from './containers/RxBreadcrumbs';

// Lazy-loaded components
const Prescriptions = lazy(() => import('./containers/Prescriptions'));
const LandingPage = lazy(() => import('./containers/LandingPage'));
const RefillPrescriptions = lazy(() =>
  import('./containers/RefillPrescriptions'),
);
const PrescriptionDetails = lazy(() =>
  import('./containers/PrescriptionDetails'),
);
const PrescriptionDetailsDocumentation = lazy(() =>
  import('./containers/PrescriptionDetailsDocumentation'),
);

// Loading component to display while lazy-loaded components are being fetched
const Loading = () => (
  <va-loading-indicator
    message="Loading..."
    set-focus
    data-testid="loading-indicator"
  />
);

// Wrapper component that provides both access guard and App container
const AppWrapper = props => {
  useMyHealthAccessGuard();
  const { id, prescriptionId } = useParams();

  return (
    <App>
      <RxBreadcrumbs />
      <Suspense fallback={<Loading />}>
        {props.children ? (
          props.children
        ) : (
          <props.Component {...props} id={id} prescriptionId={prescriptionId} />
        )}
      </Suspense>
    </App>
  );
};

AppWrapper.propTypes = {
  Component: PropTypes.elementType,
  children: PropTypes.node,
};

// Route definitions in React Router v6 object format
const routes = [
  // TODO: remove once mhvMedicationsRemoveLandingPage is turned on in prod
  {
    path: '/my-health/medications/about/*',
    element: <AppWrapper Component={LandingPage} />,
  },
  {
    path: '/my-health/medications/about',
    element: <AppWrapper Component={LandingPage} />,
  },
  {
    path: '/my-health/medications/refill',
    element: <AppWrapper Component={RefillPrescriptions} />,
  },
  {
    path: '/my-health/medications/:page',
    element: <AppWrapper Component={Prescriptions} />,
  },
  {
    path: '/my-health/medications',
    element: <AppWrapper Component={Prescriptions} />,
  },
  {
    path: '/my-health/medications/prescription/:prescriptionId/documentation',
    element: <AppWrapper Component={PrescriptionDetailsDocumentation} />,
  },
  {
    path: '/my-health/medications/prescription/:prescriptionId',
    element: <AppWrapper Component={PrescriptionDetails} />,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

// Create the router instance
const router = createBrowserRouter(routes);

export { routes, router as default };
