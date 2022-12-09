import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';

import YourClaimsPageV2 from './containers/YourClaimsPageV2';
import YourClaimLetters from './containers/YourClaimLetters';
import ClaimPage from './containers/ClaimPage';
import ClaimStatusPage from './containers/ClaimStatusPage';
import StemClaimStatusPage from './containers/StemClaimStatusPage';
import FilesPage from './containers/FilesPage';
import DetailsPage from './containers/DetailsPage';
import AskVAPage from './containers/AskVAPage';
import DocumentRequestPage from './containers/DocumentRequestPage';
import ClaimEstimationPage from './containers/ClaimEstimationPage';
import AppealsV2StatusPage from './containers/AppealsV2StatusPage';
import AppealsV2DetailPage from './containers/AppealsV2DetailPage';
import AppealInfo from './containers/AppealInfo';
import ClaimsStatusApp from './containers/ClaimsStatusApp';
import RouteWrapper from './components/RouteWrapper';

const routes = (
  <ClaimsStatusApp>
    <Switch>
      <Route path="/your-claims" exact component={YourClaimsPageV2} />
      <Route path="/your-claim-letters" component={YourClaimLetters} />
      <Route path="/appeals/:id">
        <Switch>
          <Redirect exact from="/appeals/:id" to="/appeals/:id/status" />
        </Switch>
        <AppealInfo>
          <RouteWrapper
            path="/appeals/:id/status"
            component={AppealsV2StatusPage}
          />
          <RouteWrapper
            path="/appeals/:id/detail"
            component={AppealsV2DetailPage}
          />
        </AppealInfo>
      </Route>
      <Route path="/your-claims/:id">
        <Switch>
          <Redirect
            exact
            from="/your-claims/:id"
            to="/your-claims/:id/status"
          />
        </Switch>
        <ClaimPage>
          <Route path="/your-claims/:id/status" component={ClaimStatusPage} />
          <Route path="/your-claims/:id/files" component={FilesPage} />
          <Route path="/your-claims/:id/details" component={DetailsPage} />
          <Route
            path="/your-claims/:id/ask-va-to-decide"
            component={AskVAPage}
          />
          <Route
            path="/your-claims/:id/document-request/:trackedItemId"
            component={DocumentRequestPage}
          />
          <Route
            path="/your-claims/:id/claim-estimate"
            component={ClaimEstimationPage}
          />
        </ClaimPage>
      </Route>
      <Route
        component={StemClaimStatusPage}
        path="/your-stem-claims/:id/status"
      />
      <Route path="/" exact>
        <Redirect to="/your-claims" />
      </Route>
      <Redirect from="/disability-benefits/track-claims/*" to="/your-claims" />
    </Switch>
  </ClaimsStatusApp>
);

export default routes;
