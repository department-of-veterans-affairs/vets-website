import React from 'react';
import { createBrowserRouter } from 'react-router-dom-v5-compat';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import { useMyHealthAccessGuard } from '~/platform/mhv/hooks/useMyHealthAccessGuard';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import Prescriptions from './containers/Prescriptions';
import LandingPage from './containers/LandingPage';
import RefillPrescriptions from './containers/RefillPrescriptions';
import PrescriptionDetailsDocumentation from './containers/PrescriptionDetailsDocumentation';

/**
 * Route that wraps its children within the application component.
 */
const AppRoute = ({ children }) => (
  <App>
    <RxBreadcrumbs />
    <div>{children}</div>
  </App>
);

AppRoute.propTypes = {
  children: PropTypes.node,
};

const AccessGuardWrapper = ({ children }) => {
  useMyHealthAccessGuard();
  return children;
};

const routes = [
  {
    path: '/',
    element: (
      <AccessGuardWrapper>
        <AppRoute>
          <Prescriptions />
        </AppRoute>
      </AccessGuardWrapper>
    ),
    children: [
      {
        path: 'about',
        element: (
          <AppRoute>
            <LandingPage />
          </AppRoute>
        ),
      },
      {
        path: 'refill',
        element: (
          <AppRoute>
            <RefillPrescriptions />
          </AppRoute>
        ),
      },
      {
        path: 'prescription/:prescriptionId',
        element: (
          <AppRoute>
            <PrescriptionDetails />
          </AppRoute>
        ),
      },
      {
        path: 'prescription/:prescriptionId/documentation',
        element: (
          <AppRoute>
            <PrescriptionDetailsDocumentation />
          </AppRoute>
        ),
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
