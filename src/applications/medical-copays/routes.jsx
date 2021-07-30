import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp.jsx';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Route exact path="/">
      <Redirect to="/copays" />
    </Route>
    <Route component={OverviewPage} path="/copays" />
    <Route component={DetailPage} path="/copay-detail" />
  </MedicalCopaysApp>
);

export default Routes;
