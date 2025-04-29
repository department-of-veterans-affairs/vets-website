import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
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

/**
 * Route that wraps its children within the application component.
 */
const AppRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}>
      <App>
        <RxBreadcrumbs />
        <div>{children}</div>
      </App>
    </Route>
  );
};

AppRoute.propTypes = {
  children: PropTypes.object,
};

const AccessGuardWrapper = ({ children }) => {
  useMyHealthAccessGuard();
  return children;
};

const routes = (
  <AccessGuardWrapper>
    <Suspense fallback={<Loading />}>
      <Switch>
        {/* TODO: remove once mhvMedicationsRemoveLandingPage is turned on in prod */}
        <AppRoute exact path={['/about', '/about/*']} key="LandingPage">
          <LandingPage />
        </AppRoute>
        <AppRoute exact path={['/refill']} key="RefillPage">
          <div>
            <RefillPrescriptions />
          </div>
        </AppRoute>
        <AppRoute exact path={['/', '/:page']} key="App">
          <div>
            <Prescriptions />
          </div>
        </AppRoute>
        <AppRoute
          exact
          path="/prescription/:prescriptionId"
          key="prescriptionDetails"
        >
          <PrescriptionDetails />
        </AppRoute>
        <AppRoute
          exact
          path="/prescription/:prescriptionId/documentation"
          key="prescriptionDetailsDocumentation"
        >
          <PrescriptionDetailsDocumentation />
        </AppRoute>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </Suspense>
  </AccessGuardWrapper>
);

export default routes;
