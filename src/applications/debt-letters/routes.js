import React from 'react';
import { Route, IndexRoute } from 'react-router';
import DebtLettersList from './components/DebtLettersList';
import DebtLettersSummary from './components/DebtLettersSummary';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';

const routes = (
  <Route path="/">
    <Route component={DebtLettersWrapper} key="/main">
      <IndexRoute component={DebtLettersList} key="/debt-list" />
      <Route component={DebtDetails} key="/print" path="/view-details" />
    </Route>
  </Route>
);

export default routes;
