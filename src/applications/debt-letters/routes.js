import React from 'react';
import { Route, IndexRoute } from 'react-router';
import DebtLettersSummary from './components/DebtLettersSummary';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';
import DebtLettersDownload from './components/DebtLettersDownload';

const routes = (
  <Route path="/">
    <Route component={DebtLettersWrapper} key="/main">
      <IndexRoute component={DebtLettersSummary} key="/debt-list" />
      <Route component={DebtDetails} key="/debt-detail" path="/debt-detail" />
      <Route component={DebtLettersDownload} path="/debt-letters" />
    </Route>
  </Route>
);

export default routes;
