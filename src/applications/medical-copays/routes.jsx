import React from 'react';
import { Route } from 'react-router-dom';
import MedicalCopaysApp from './containers/MedicalCopaysApp.jsx';
import OverviewPage from './containers/OverviewPage';
import DetailPage from './containers/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Route exact path="/" component={OverviewPage} />
    <Route path="/balance-details" component={DetailPage} />
  </MedicalCopaysApp>
);

export default Routes;
