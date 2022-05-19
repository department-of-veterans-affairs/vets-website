import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';
import HTMLStatementPage from './containers/HTMLStatementPage';

const MedicalCopaysRoutes = () => (
  <MedicalCopaysApp>
    <Switch>
      <Route path="/" component={OverviewPage} />
      <Route path="/balance-details/:id" component={DetailPage} />
      <Route
        path="/balance-details/:id/statement-view"
        component={HTMLStatementPage}
      />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </MedicalCopaysApp>
);

export default MedicalCopaysRoutes;
