import React from 'react';
import { Switch, Route } from 'react-router-dom';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';

const routes = (
  <Switch>
    <Route exact path="/" title="TravelPayHome">
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/:id">
      <TravelClaimDetails />
    </Route>
  </Switch>
);

export default routes;
