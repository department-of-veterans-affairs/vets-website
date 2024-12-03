import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import ClaimStatusExplainerPage from './pages/ClaimStatusExplainerPage';

const routes = (
  <Switch>
    <Route exact path="/">
      <Redirect to="/claims" />
    </Route>
    <Route exact path="/claims" title="TravelPayHome">
      <MhvSecondaryNav />
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/claims/:id">
      <MhvSecondaryNav />
      <TravelClaimDetails />
    </Route>
    <Route exact path="/what-does-my-claim-status-mean">
      <MhvSecondaryNav />
      <ClaimStatusExplainerPage />
    </Route>
  </Switch>
);

export default routes;
