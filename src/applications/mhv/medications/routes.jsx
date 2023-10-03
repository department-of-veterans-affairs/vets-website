import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';

const routes = (
  <div className="vads-l-grid-container">
    <div className="main-content vads-l-col--12 medium-screen:vads-l-col--8 medium-screen:vads-u-margin-left--neg2">
      <RxBreadcrumbs />
      <div>
        <Switch>
          <Route exact path="/" key="App">
            <App />
          </Route>
          <Route exact path="/:prescriptionId" key="prescriptionDetails">
            <PrescriptionDetails />
          </Route>
        </Switch>
      </div>
    </div>
  </div>
);

export default routes;
