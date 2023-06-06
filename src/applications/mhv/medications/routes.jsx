import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import PrescriptionDetails from './containers/PrescriptionDetails';

const routes = (
  <div className="vads-l-grid-container main-content">
    <Switch>
      <Route exact path="/" key="App">
        <App />
      </Route>
      <Route
        exact
        path="/prescriptions/:prescriptionId"
        key="prescriptionDetails"
      >
        <PrescriptionDetails />
      </Route>
    </Switch>
  </div>
);

export default routes;
