import React, { Suspense } from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { MhvPageNotFound } from '@department-of-veterans-affairs/mhv/exports';
import { selectUser } from '@department-of-veterans-affairs/platform-user/selectors';
import { lazyWithRetry } from '@department-of-veterans-affairs/platform-utilities/lazy-load-with-retry';
import manifest from './manifest.json';
import AppProviders from './containers/AppProviders';
import App from './containers/App';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
// import { allergiesLoader } from './loaders/allergiesLoader';
// Disabling loaders temporarily while rolling out Oracle Health Pilot
// TODO: When the pilot is complete, re-enable loaders
// import { prescriptionsLoader } from './loaders/prescriptionsLoader';

const Prescriptions = lazyWithRetry(() => import('./containers/Prescriptions'));
const RefillPrescriptions = lazyWithRetry(() =>
  import('./containers/RefillPrescriptions'),
);
const PrescriptionDetails = lazyWithRetry(() =>
  import('./containers/PrescriptionDetails'),
);
const PrescriptionDetailsDocumentation = lazyWithRetry(() =>
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

const RouteWrapper = props => {
  const { id, prescriptionId } = useParams();
  const user = useSelector(selectUser);

  return (
    <AppProviders user={user}>
      <App>
        <RxBreadcrumbs />
        <Suspense fallback={<Loading />}>
          {props.children ? (
            props.children
          ) : (
            <props.Component
              {...props}
              id={id}
              prescriptionId={prescriptionId}
            />
          )}
        </Suspense>
      </App>
    </AppProviders>
  );
};

RouteWrapper.propTypes = {
  Component: PropTypes.elementType,
  children: PropTypes.node,
};

const routes = [
  {
    path: 'refill',
    element: <RouteWrapper Component={RefillPrescriptions} />,
    // loader: prescriptionsLoader,
  },
  {
    path: '/',
    element: <RouteWrapper Component={Prescriptions} />,
    // loader: prescriptionsLoader,
  },
  {
    path: 'prescription/:prescriptionId/documentation',
    element: <RouteWrapper Component={PrescriptionDetailsDocumentation} />,
    // loader: prescriptionsLoader,
  },
  {
    path: 'prescription/:prescriptionId',
    element: <RouteWrapper Component={PrescriptionDetails} />,
    // loader: allergiesLoader,
  },
  {
    path: '*',
    element: <MhvPageNotFound />,
  },
];

const router = createBrowserRouter(routes, {
  basename: manifest.rootUrl,
});

export { routes, router as default };
