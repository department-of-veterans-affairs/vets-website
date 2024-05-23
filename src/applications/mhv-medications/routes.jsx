import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import Prescriptions from './containers/Prescriptions';
import LandingPage from './containers/LandingPage';
import RefillPrescriptions from './containers/RefillPrescriptions';

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

const routes = (
  <Switch>
    <AppRoute exact path={['/about', '/about/*']} key="LandingPage">
      <LandingPage />
    </AppRoute>
    <AppRoute exact path={['/refill']} key="RefillPage">
      <div>
        <RefillPrescriptions />
        <div className="no-print">
          <va-back-to-top />
        </div>
      </div>
    </AppRoute>
    <AppRoute exact path={['/', '/:page']} key="App">
      <div>
        <Prescriptions />
        <div className="no-print">
          <va-back-to-top />
        </div>
      </div>
    </AppRoute>
    <AppRoute
      exact
      path="/prescription/:prescriptionId"
      key="prescriptionDetails"
    >
      <PrescriptionDetails />
    </AppRoute>
    <Route>
      <PageNotFound />
    </Route>
  </Switch>
);

export default routes;
