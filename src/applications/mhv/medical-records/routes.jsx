import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HealthHistory from './containers/HealthHistory';
import VaccineDetails from './containers/VaccineDetails';
import Vaccines from './containers/Vaccines';
import VitalDetails from './containers/VitalDetails';
import Vitals from './containers/Vitals';
import App from './containers/App';
import MrBreadcrumbs from './components/MrBreadcrumbs';
import Navigation from './components/Navigation';

const routes = (
  <div className="vads-l-grid-container">
    <MrBreadcrumbs />
    <div className="medical-records-container">
      <Navigation />
      <div className="vads-l-grid-container main-content">
        <Switch>
          <Route exact path="/" key="Medical Records Home">
            <App />
          </Route>
          <Route exact path="/health-history" key="Health History">
            <HealthHistory />
          </Route>
          <Route exact path="/health-history/vaccines" key="Vaccines">
            <Vaccines />
          </Route>
          <Route path="/health-history/vaccines/:vaccineId" key="Vaccine">
            <VaccineDetails />
          </Route>
          <Route exact path="/health-history/vitals" key="Vitals">
            <Vitals />
          </Route>
          <Route path="/health-history/vitals/:vitalType" key="VitalDetails">
            <VitalDetails />
          </Route>
        </Switch>
      </div>
    </div>
  </div>
);

export default routes;
