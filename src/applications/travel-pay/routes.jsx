import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import SubmitFlowWrapper from './containers/SubmitFlowWrapper';

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
    <Route exact path="/new/:apptId">
      <SubmitFlowWrapper />
    </Route>
  </Switch>
);

export default routes;
