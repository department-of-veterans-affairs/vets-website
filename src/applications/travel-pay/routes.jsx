import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import ClaimStatusExplainerPage from './containers/pages/ClaimStatusExplainerPage';

const routes = (
  <Switch>
    <Route exact path="/" title="TravelPayHome">
      <MhvSecondaryNav />
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/claims/:id">
      <MhvSecondaryNav />
      <TravelClaimDetails />
    </Route>
    <Route exact path="/help">
      <Redirect to="/help/what-does-my-claim-status-mean" />
    </Route>
    <Route exact path="/help/what-does-my-claim-status-mean">
      <MhvSecondaryNav />
      <ClaimStatusExplainerPage />
    </Route>
  </Switch>
);

export default routes;
