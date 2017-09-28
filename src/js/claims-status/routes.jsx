import React from 'react';
import { Route, IndexRedirect, Redirect } from 'react-router';

import YourClaimsPage from './containers/YourClaimsPage.jsx';
import ClaimPage from './containers/ClaimPage.jsx';
import ClaimStatusPage from './containers/ClaimStatusPage.jsx';
import AppealStatusPage from './containers/AppealStatusPage.jsx';
import AppealLearnMorePage from './components/AppealLearnMorePage.jsx';
import FilesPage from './containers/FilesPage.jsx';
import DetailsPage from './containers/DetailsPage.jsx';
import AskVAPage from './containers/AskVAPage.jsx';
import DocumentRequestPage from './containers/DocumentRequestPage.jsx';
import AdditionalEvidencePage from './containers/AdditionalEvidencePage.jsx';
import ClaimEstimationPage from './containers/ClaimEstimationPage.jsx';
import AppealLayout from './components/AppealLayout';

const routes = [
  <Redirect
    key="/track-claims/your-claims"
    from="/disability-benefits/track-claims*"
    to="/your-claims"/>,
  <Route
    component={YourClaimsPage}
    key="/your-claims"
    path="/your-claims"/>,
  <Route
    component={YourClaimsPage}
    showClosedClaims
    key="/your-claims/closed"
    path="/your-claims/closed"/>,
  <Route
    component={AppealLayout}
    key="/appeals"
    path="/appeals">
    <Route
      component={AppealStatusPage}
      key=":id/status"
      path=":id/status"/>,
    <Route
      component={AppealLearnMorePage}
      key="/appeals/learn-more"
      path="/appeals/learn-more"/>,
  </Route>,
  <Route
    component={ClaimPage}
    key="/your-claims/:id"
    path="/your-claims/:id">
    <IndexRedirect to="status"/>
    <Route
      component={ClaimStatusPage}
      path="status"/>,
    <Route
      component={FilesPage}
      path="files"/>,
    <Route
      component={DetailsPage}
      path="details"/>,
    <Route
      component={AskVAPage}
      path="ask-va-to-decide"/>
    <Route
      component={AdditionalEvidencePage}
      key="additional-evidence"
      path="additional-evidence"/>,
    <Route
      component={DocumentRequestPage}
      path="document-request/:trackedItemId"/>
    <Route
      component={ClaimEstimationPage}
      key="claim-estimate"
      path="claim-estimate"/>,
  </Route>,
];

export default routes;
