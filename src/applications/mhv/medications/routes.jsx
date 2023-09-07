import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';
import RxBreadcrumbs from './containers/RxBreadcrumbs';

const routes = (
  <div className="vads-l-grid-container main-content">
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
);

export default routes;
