import React from 'react';
import { Route, Switch } from 'react-router-dom';

import DebtLettersSummary from './components/DebtLettersSummary';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';
import DebtLettersDownload from './components/DebtLettersDownload';

const routes = (
  <Switch>
    <Route component={DebtLettersWrapper} key="/main">
      <Route component={DebtDetails} key="/debt-detail" path="/debt-detail" />
      <Route component={DebtLettersDownload} path="/debt-letters" />
      <Route component={DebtLettersSummary} path="/" key="/debt-list" />
    </Route>
  </Switch>
);

export default routes;
