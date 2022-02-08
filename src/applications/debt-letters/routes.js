import React from 'react';
import { Route } from 'react-router-dom';
import DebtLettersSummary from './components/DebtLettersSummary';
import DebtLettersWrapper from './components/DebtLettersWrapper';
import DebtDetails from './components/DebtDetails';
import DebtLettersDownload from './components/DebtLettersDownload';

const Routes = () => {
  return (
    <DebtLettersWrapper>
      <Route component={DebtDetails} exact path="/debt-detail/:id" />
      <Route component={DebtLettersDownload} exact path="/debt-letters" />
      <Route component={DebtLettersSummary} exact path="/" />
    </DebtLettersWrapper>
  );
};

export default Routes;
