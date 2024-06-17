import React from 'react';
import { Switch, Route } from 'react-router-dom';

import TravelPayStatusApp from './containers/TravelPayStatusApp';
import ClaimStatusExplainer from './components/ClaimStatusExplainer';

const routes = (
  <Switch>
    <Route exact path="/" title="TravelPayHome">
      <TravelPayStatusApp />
    </Route>
    <Route exact path="/what-does-my-status-mean" key="StatusExplainer">
      <ClaimStatusExplainer />
    </Route>
  </Switch>
);

export default routes;
