import React from 'react';
import { Switch, Route } from 'react-router-dom';
import {
  DowntimeNotification,
  externalServices,
} from 'platform/monitoring/DowntimeNotification';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';
import Prescriptions from './containers/Prescriptions';

const routes = (
  <div className="vads-l-grid-container">
    <div className="main-content vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-margin-left--neg2 vads-u-max-width--100">
      <App>
        <RxBreadcrumbs />
        <DowntimeNotification
          appTitle="Medications"
          dependencies={[externalServices.mhv]}
        >
          <div>
            <Switch>
              <Route exact path={['/', '/:page']} key="App">
                <div>
                  <Prescriptions />
                  <va-back-to-top />
                </div>
              </Route>
              <Route
                exact
                path="/prescription/:prescriptionId"
                key="prescriptionDetails"
              >
                <PrescriptionDetails />
              </Route>
            </Switch>
          </div>
        </DowntimeNotification>
      </App>
    </div>
  </div>
);

export default routes;
