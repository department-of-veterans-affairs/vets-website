import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import recordEvent from '~/platform/monitoring/record-event';
import OverviewPage from './containers/OverviewPage';
import CombinedPortalApp from './containers/CombinedPortalApp';
import CombinedStatements from './containers/CombinedStatements';
import Details from '../medical-copays/containers/Details';
import HTMLStatementPage from '../medical-copays/containers/HTMLStatementPage';
import MCPOverview from '../medical-copays/containers/SummaryPage';
import DebtDetails from '../debt-letters/containers/DebtDetails';
import DebtLettersDownload from '../debt-letters/containers/DebtLettersDownload';
import DebtLettersSummary from '../debt-letters/containers/DebtLettersSummary';
import ResolvePage from '../medical-copays/containers/ResolvePage';
import ResolveDebtPage from '../debt-letters/containers/ResolveDebtPage';

const Routes = () => (
  <CombinedPortalApp>
    <Switch>
      <Route exact path="/" component={OverviewPage} />
      <Route
        exact
        path="/copay-balances"
        component={MCPOverview}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-enter-mcp' });
        }}
      />
      <Route exact path="/copay-balances/:id/detail" component={Details} />
      <Route
        exact
        path="/copay-balances/:id/detail/statement"
        component={HTMLStatementPage}
      />
      <Route exact path="/copay-balances/:id/resolve" component={ResolvePage} />
      <Route exact path="/debt-balances" component={DebtLettersSummary} />
      <Route
        exact
        path="/debt-balances/letters"
        component={DebtLettersDownload}
        onClick={() => {
          recordEvent({ event: 'cta-link-click-enter-ltr' });
        }}
      />
      <Route exact path="/debt-balances/details/:id" component={DebtDetails} />
      <Route
        exact
        path="/debt-balances/details/:id/resolve"
        component={ResolveDebtPage}
      />
      <Route exact path="/combined-statements" component={CombinedStatements} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </CombinedPortalApp>
);

export default Routes;
