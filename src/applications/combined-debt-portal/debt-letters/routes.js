import React from 'react';
import { Route } from 'react-router-dom';
import DebtLettersSummary from './containers/DebtLettersSummary';
import DebtLettersApp from './containers/DebtLettersApp';
import DebtDetails from './containers/DebtDetails';
import DebtLettersDownload from './containers/DebtLettersDownload';

const DebtRoutes = () => {
  return (
    <DebtLettersApp>
      <Route component={DebtDetails} path="/debt-detail/:id" />
      <Route component={DebtLettersDownload} path="/debt-letters" />
      <Route component={DebtLettersSummary} path="/" />
    </DebtLettersApp>
  );
};

export default DebtRoutes;
