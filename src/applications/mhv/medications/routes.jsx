import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import Prescriptions from './containers/Prescriptions';
import LandingPage from './containers/LandingPage';
import PrescriptionsPrintOnly from './containers/PrescriptionsPrintOnly';

/**
 * Route that wraps its children within the application component.
 */
const AppRoute = ({ children, ...rest }) => {
  return (
    <Route {...rest}>
      <App>
        <RxBreadcrumbs />
        <div>{children}</div>
        <PrescriptionsPrintOnly />
      </App>
    </Route>
  );
};

AppRoute.propTypes = {
  children: PropTypes.object,
};

const routes = (
  <div className="vads-l-grid-container">
    <div className="main-content vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-margin-left--neg2 vads-u-max-width--100">
      <Switch>
        <AppRoute exact path={['/about', '/about/*']} key="LandingPage">
          <LandingPage />
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
    </div>
  </div>
);

export default routes;
