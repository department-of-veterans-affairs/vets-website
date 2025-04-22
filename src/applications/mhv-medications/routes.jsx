import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';

import manifest from './manifest.json';

import App from './containers/App';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import { allergiesLoader } from './loaders/allergiesLoader';

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

const routes = [
  // TODO: remove once mhvMedicationsRemoveLandingPage is turned on in prod
  {
    path: 'about/*',
    element: <AppWrapper Component={LandingPage} />,
  },
  {
    path: 'about',
    element: <AppWrapper Component={LandingPage} />,
  },
  {
    path: 'refill',
    element: <AppWrapper Component={RefillPrescriptions} />,
  },
  {
    path: ':page',
    element: <AppWrapper Component={Prescriptions} />,
    loader: allergiesLoader,
  },
  {
    path: '/',
    element: <AppWrapper Component={Prescriptions} />,
    loader: allergiesLoader,
  },
  {
    path: 'prescription/:prescriptionId/documentation',
    element: <AppWrapper Component={PrescriptionDetailsDocumentation} />,
  },
  {
    path: 'prescription/:prescriptionId',
    element: <AppWrapper Component={PrescriptionDetails} />,
    loader: allergiesLoader,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
