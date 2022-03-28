import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';
import HTMLStatementPage from './containers/HTMLStatementPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Switch>
      <Route exact path="/" component={OverviewPage} />
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
  </MedicalCopaysApp>
);

export default Routes;
