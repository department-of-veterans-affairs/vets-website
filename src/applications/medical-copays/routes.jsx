import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import MedicalCopaysApp from './components/MedicalCopaysApp.jsx';
import OverviewPage from './components/OverviewPage';
import DetailPage from './components/DetailPage';

const routes = (
  <Route path="/" component={MedicalCopaysApp}>
    <IndexRedirect to="copays" />
    <Route component={OverviewPage} path="copays" />
    <Route component={DetailPage} path="copay-detail" />
  </Route>
);

export default routes;
