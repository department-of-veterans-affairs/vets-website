import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';

const routes = (
  <Switch>
    <Route exact path="/" title="TravelPayHome">
      <MhvSecondaryNav />
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/:id">
      <MhvSecondaryNav />
      <TravelClaimDetails />
    </Route>
  </Switch>
);

export default routes;
