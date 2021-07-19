import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import DebtLettersSummary from './components/DebtLettersSummary';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';
import DebtLettersDownload from './components/DebtLettersDownload';

const Routes = () => {
  return (
    <Router basename="/manage-va-debt/your-debt">
      <Switch>
        <Route component={DebtLettersWrapper}>
          <Route component={DebtDetails} path="/debt-detail/:id" />
          <Route component={DebtLettersDownload} path="/debt-letters" />
          <Route component={DebtLettersSummary} path="/" />
        </Route>
      </Switch>
    </Router>
  );
};

export default Routes;
