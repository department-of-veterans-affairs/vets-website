import React from 'react';
import { Route, IndexRoute } from 'react-router';
import DebtLettersList from './components/DebtLettersList';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';
import LandingPage from './components/LandingPage';

const routes = (
  <Route path="/">
    <Route component={DebtLettersWrapper} key="/main">
      <IndexRoute key="/landing-page" component={LandingPage} />
      <Route component={DebtLettersList} key="/debt-list" path="/debt-list" />
      <Route component={DebtDetails} key="/print" path="/view-details" />
    </Route>
  </Route>
);

export default routes;
