import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { MhvSecondaryNav } from '@department-of-veterans-affairs/mhv/exports';
import TravelPayStatusApp from './containers/TravelPayStatusApp';
import TravelClaimDetails from './components/TravelClaimDetails';
import ClaimStatusExplainerPage from './containers/pages/ClaimStatusExplainerPage';
import SubmitFlowWrapper from './containers/SubmitFlowWrapper';
import FileClaimExplainerPage from './containers/pages/FileClaimExplainerPage';

const routes = (
  <Switch>
    <Route exact path="/" title="TravelPayHome">
      <Redirect to="/claims/" />
    </Route>
    <Route exact path="/claims/" title="TravelPayHome">
      <MhvSecondaryNav />
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/help">
      <MhvSecondaryNav />
      <ClaimStatusExplainerPage />
    </Route>
    <Route exact path="/file-new-claim">
      <MhvSecondaryNav />
      <FileClaimExplainerPage />
    </Route>
    <Route path="/file-new-claim/:apptId">
      <MhvSecondaryNav />
      <SubmitFlowWrapper />
    </Route>
    <Route path="/claims/:id">
      <MhvSecondaryNav />
      <TravelClaimDetails />
    </Route>
  </Switch>
);

export default routes;
