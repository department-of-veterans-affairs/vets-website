import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import OverviewPage from './containers/OverviewPage';
import CombinedPortalApp from './containers/CombinedPortalApp';
import DetailPage from '../medical-copays/containers/DetailPage';
import HTMLStatementPage from '../medical-copays/containers/HTMLStatementPage';
import MCPOverview from '../medical-copays/containers/OverviewPage';

const Routes = () => (
  <CombinedPortalApp>
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route path="/medical-copays-index" component={MCPOverview} />
      <Route exact path="/balance-details/:id" component={DetailPage} />
      <Route
        exact
        path="/balance-details/:id/statement-view"
        component={HTMLStatementPage}
      />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </CombinedPortalApp>
);

export default Routes;
