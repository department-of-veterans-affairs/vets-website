import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp.jsx';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Redirect exact from="/" to="/copays" />
    <Route component={OverviewPage} exact path="/copays" />
    <Route component={DetailPage} exact path="/copay-detail" />
  </MedicalCopaysApp>
);

export default Routes;
