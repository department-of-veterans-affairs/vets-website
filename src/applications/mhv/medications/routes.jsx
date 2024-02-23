import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PageNotFound from '@department-of-veterans-affairs/platform-site-wide/PageNotFound';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import Prescriptions from './containers/Prescriptions';
import LandingPage from './containers/LandingPage';
import PrescriptionsPrintOnly from './containers/PrescriptionsPrintOnly';
import RefillPrescriptions from './containers/RefillPrescriptions';

const routes = (
  <div className="vads-l-grid-container">
    <div className="main-content vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-margin-left--neg2 vads-u-max-width--100">
      <App>
        <RxBreadcrumbs />
        <div>
          <Switch>
            <Route exact path={['/about', '/about/*']} key="LandingPage">
              <LandingPage />
            </Route>
            <Route exact path={['/refill']} key="App">
              <div>
                <RefillPrescriptions />
                <div className="no-print">
                  <va-back-to-top />
                </div>
              </div>
            </Route>
            <Route exact path={['/']} key="App">
              <div>
                <Prescriptions />
                <div className="no-print">
                  <va-back-to-top />
                </div>
              </div>
            </Route>
            <Route
              exact
              path="/prescription/:prescriptionId"
              key="prescriptionDetails"
            >
              <PrescriptionDetails />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </div>
        <PrescriptionsPrintOnly />
      </App>
    </div>
  </div>
);

export default routes;
