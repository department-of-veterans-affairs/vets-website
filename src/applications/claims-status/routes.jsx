import React from 'react';
import { Route, IndexRedirect, Redirect } from 'react-router';

import { Toggler } from 'platform/utilities/feature-toggles';
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
import OverviewPage from './containers/OverviewPage';

const routes = (
  <Route path="/" component={ClaimsStatusApp}>
    <IndexRedirect to="/your-claims" />
    <Redirect
      key="/track-claims/your-claims"
      from="/disability-benefits/track-claims*"
      to="/your-claims"
    />
    <Route
      component={YourClaimsPageV2}
      key="/your-claims"
      path="/your-claims"
    />
    <Route
      component={YourClaimLetters}
      key="/your-claim-letters"
      path="/your-claim-letters"
    />
    <Route component={AppealInfo} key="/appeals/:id" path="/appeals/:id">
      <IndexRedirect to="status" />
      <Route component={AppealsV2StatusPage} key="status" path="status" />
      <Route component={AppealsV2DetailPage} key="detail" path="detail" />
    </Route>
    <Route component={ClaimPage} key="/your-claims/:id" path="/your-claims/:id">
      <IndexRedirect to="status" />
      <Route component={ClaimStatusPage} path="status" />,
      <Route component={FilesPage} path="files" />,
      <Route component={DetailsPage} path="details" />,
      <Toggler toggleName={Toggler.TOGGLE_NAMES.cstUseClaimDetailsV2}>
        <Toggler.Enabled>
          <Route component={OverviewPage} path="overview" />,
        </Toggler.Enabled>
      </Toggler>
      <Route component={AskVAPage} path="ask-va-to-decide" />,
      <Route
        component={DocumentRequestPage}
        path="document-request/:trackedItemId"
      />
      <Route
        component={ClaimEstimationPage}
        key="claim-estimate"
        path="claim-estimate"
      />
    </Route>
    <Route
      component={StemClaimStatusPage}
      key="/your-stem-claims/:id/status"
      path="/your-stem-claims/:id/status"
    />
  </Route>
);

export default routes;
