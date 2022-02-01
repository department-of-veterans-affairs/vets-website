import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route path="/balance-details/:id" component={DetailPage} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </MedicalCopaysApp>
);

export default Routes;
