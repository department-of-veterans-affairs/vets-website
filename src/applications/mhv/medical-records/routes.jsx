import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HealthHistory from './containers/HealthHistory';
import VaccineDetails from './containers/VaccineDetails';
import Vaccines from './containers/Vaccines';
import VitalDetails from './containers/VitalDetails';
import Vitals from './containers/Vitals';
import App from './containers/App';
import MrBreadcrumbs from './containers/MrBreadcrumbs';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <Switch>
      <Route exact path="/">
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
      <Route exact path="/vitals" key="Vitals">
        <Vitals />
      </Route>
      <Route exact path="/vital-details/:vitalType" key="VitalDetails">
        <VitalDetails />
      </Route>
    </Switch>
  </div>
);

export default routes;
