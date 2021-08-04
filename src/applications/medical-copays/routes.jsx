import React from 'react';
import { Route } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp.jsx';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Route component={OverviewPage} exact path="/" />
    <Route component={DetailPage} exact path="/balance-details" />
  </MedicalCopaysApp>
);

export default Routes;
