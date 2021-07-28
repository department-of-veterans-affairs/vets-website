import React from 'react';
import { Route } from 'react-router-dom';
import MedicalCopaysApp from './components/MedicalCopaysApp.jsx';
import OverviewPage from './components/OverviewPage';
import DetailPage from './components/DetailPage';

const Routes = () => (
  <MedicalCopaysApp>
    <Route component={OverviewPage} exact path="/copays" />
    <Route component={DetailPage} exact path="/copay-detail" />
  </MedicalCopaysApp>
);

export default Routes;
