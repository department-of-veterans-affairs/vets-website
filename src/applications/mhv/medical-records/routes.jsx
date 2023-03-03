import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Vaccines from './containers/Vaccines';
import VaccineDetails from './containers/VaccineDetails';
import HealthHistory from './containers/HealthHistory';
import MrBreadcrumbs from './components/MrBreadcrumbs';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <Switch>
      <Route exact path="/" key="App">
        <App />
      </Route>
      <Route exact path="/health-history" key="Health History">
        <HealthHistory />
      </Route>
      <Route exact path="/vaccines" key="Vaccines">
        <Vaccines />
      </Route>
      <Route exact path="/vaccine-details/:vaccineId" key="Vaccine">
        <VaccineDetails />
      </Route>
    </Switch>
  </div>
);

export default routes;
