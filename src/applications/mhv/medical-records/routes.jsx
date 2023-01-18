import React from 'react';
import { Switch, Route } from 'react-router-dom';
import MrBreadcrumbs from './containers/MrBreadcrumbs';
import App from './containers/App';
import Vaccines from './containers/Vaccines';
import VaccineDetails from './containers/VaccineDetails';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <Switch>
      <Route exact path="/" key="App">
        <App />
      </Route>
      <Route exact path="/vaccines" key="Vaccines">
        <Vaccines />
      </Route>
      <Route exact path="/vaccine" key="vaccine">
        <VaccineDetails />
      </Route>
    </Switch>
  </div>
);

export default routes;
