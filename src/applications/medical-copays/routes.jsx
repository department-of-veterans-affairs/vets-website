import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp.jsx';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Route exact path="/" component={OverviewPage} />
    <Route path="/balance-details/:id" component={DetailPage} />
    <Redirect exact from="/balance-details" to="/" />
  </MedicalCopaysApp>
);

export default Routes;
