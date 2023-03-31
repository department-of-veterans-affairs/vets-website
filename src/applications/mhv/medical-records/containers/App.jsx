import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HealthHistory from './HealthHistory';
import VaccineDetails from './VaccineDetails';
import Vaccines from './Vaccines';
import VitalDetails from './VitalDetails';
import Vitals from './Vitals';

const App = () => {
  return (
    <>
      <Switch>
        <Route exact path="/">
          <h1 className="vads-u-margin-bottom--1p5">Medical Records</h1>
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
    </>
  );
};

export default App;
