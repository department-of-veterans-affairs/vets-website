import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import OverviewPage from './containers/OverviewPage';
import CombinedPortalApp from './containers/CombinedPortalApp';
import DetailPage from '../medical-copays/containers/DetailPage';
import HTMLStatementPage from '../medical-copays/containers/HTMLStatementPage';
import MCPOverview from '../medical-copays/containers/OverviewPage';
import DebtDetails from '../debt-letters/containers/DebtDetails';
import DebtLettersDownload from '../debt-letters/containers/DebtLettersDownload';
import DebtLettersSummary from '../debt-letters/containers/DebtLettersSummary';

const Routes = () => (
  <CombinedPortalApp>
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route exact path="/copay-balances" component={MCPOverview} />
      <Route exact path="/copay-balances/:id/detail" component={DetailPage} />
      <Route
        exact
        path="/copay-balances/:id/detail/statement"
        component={HTMLStatementPage}
      />
      <Route exact path="/debt-balances" component={DebtLettersSummary} />
      <Route
        exact
        path="/debt-balances/letters"
        component={DebtLettersDownload}
      />
      <Route exact path="/debt-balances/details/:id" component={DebtDetails} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </CombinedPortalApp>
);

export default Routes;
