import React from 'react';
import { Switch, Route } from 'react-router-dom';
import App from './containers/App';
import Vaccines from './containers/Vaccines';
import VaccineDetails from './containers/VaccineDetails';

const routes = (
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
);

export default routes;
